import 'source-map-support/register';
import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import {
  BlockPublicAccess,
  Bucket,
  BucketAccessControl,
  BucketEncryption,
} from 'aws-cdk-lib/aws-s3';
import { BuildSpec } from 'aws-cdk-lib/aws-codebuild';
import { Repository } from 'aws-cdk-lib/aws-codecommit';
import * as amplify from '@aws-cdk/aws-amplify-alpha';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import {
  AwsIntegration,
  MethodLoggingLevel,
  PassthroughBehavior,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway';

const app = new App();

const stack = new Stack(app, 'ConfidentialEngineBackendStack');

// DynamoDB
const appListTable = new Table(stack, 'ConfidentialEngine-Apps', {
  tableName: 'ConfidentialEngine-Apps',
  partitionKey: {
    name: 'appId',
    type: AttributeType.STRING,
  },
  billingMode: BillingMode.PAY_PER_REQUEST,
});

const requestListTable = new Table(stack, 'ConfidentialEngine-Requests', {
  tableName: 'ConfidentialEngine-Requests',
  partitionKey: {
    name: 'requestId',
    type: AttributeType.STRING,
  },
  billingMode: BillingMode.PAY_PER_REQUEST,
});

// S3
const appRepository = new Bucket(stack, 'ConfidentialEngine-AppRepository', {
  accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
  encryption: BucketEncryption.S3_MANAGED,
  blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
});

const artifactStorage = new Bucket(
  stack,
  'ConfidentialEngine-ArtifactStorage',
  {
    accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
    blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
  },
);

// API Gateway
const restApiRole = new Role(stack, 'Role', {
  assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
  path: '/',
});
artifactStorage.grantRead(restApiRole);

const restApi = new RestApi(stack, 'ConfidentialEngine-RestApi', {
  restApiName: 'confidential-engine-api',
  deployOptions: {
    stageName: 'v1',
    loggingLevel: MethodLoggingLevel.INFO,
    dataTraceEnabled: true,
  },
  binaryMediaTypes: ['*/*'],
});

const artifacts = restApi.root.addResource('artifacts');
const fileName = artifacts.addResource('{fileName}');
fileName.addMethod(
  'GET',
  new AwsIntegration({
    service: 's3',
    integrationHttpMethod: 'GET',
    path: `${artifactStorage.bucketName}/{fileName}`,
    options: {
      credentialsRole: restApiRole,
      passthroughBehavior: PassthroughBehavior.WHEN_NO_MATCH,
      requestParameters: {
        'integration.request.header.Accept': 'method.request.header.Accept',
        'integration.request.path.fileName': 'method.request.path.fileName',
      },
      integrationResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Timestamp':
              'integration.response.header.Date',
            'method.response.header.Content-Length':
              'integration.response.header.Content-Length',
            'method.response.header.Content-Type':
              'integration.response.header.Content-Type',
          },
        },
      ],
    },
  }),
  {
    requestParameters: {
      'method.request.header.Accept': true,
      'method.request.path.fileName': true,
    },
    methodResponses: [
      {
        statusCode: '200',
        responseParameters: {
          'method.response.header.Timestamp': true,
          'method.response.header.Content-Length': true,
          'method.response.header.Content-Type': true,
        },
      },
    ],
  },
);

// Amplify Hosting
const repository = new Repository(
  stack,
  'ConfidentialEngine-MirrorRepository',
  {
    repositoryName: 'ConfidentialEngine-MirrorRepository',
  },
);
const integratorConsoleApp = new amplify.App(
  stack,
  'ConfidentialEngine-IntegratorConsole',
  {
    sourceCodeProvider: new amplify.CodeCommitSourceCodeProvider({
      repository,
    }),
    buildSpec: BuildSpec.fromObjectToYaml({
      version: '1.0',
      applications: [
        {
          appRoot: 'frontend/integrator-console',
          frontend: {
            phases: {
              preBuild: {
                commands: ['npm ci'],
              },
              build: {
                commands: ['npm run build'],
              },
            },
            artifacts: {
              baseDirectory: '.next',
              files: ['**/*'],
            },
            cache: {
              paths: ['node_modules/**/*'],
            },
          },
        },
      ],
    }),
    environmentVariables: {
      AMPLIFY_MONOREPO_APP_ROOT: 'frontend/integrator-console',
    },
  },
);
integratorConsoleApp.addBranch('main', {
  autoBuild: true,
  stage: 'PRODUCTION',
});

// Exports
new CfnOutput(stack, 'AppListTableName', { value: appListTable.tableName });
new CfnOutput(stack, 'RequestListTableName', {
  value: requestListTable.tableName,
});
new CfnOutput(stack, 'RepositoryArn', { value: appRepository.bucketArn });
new CfnOutput(stack, 'StorageArn', { value: artifactStorage.bucketArn });
new CfnOutput(stack, 'RestApiUrl', { value: restApi.url });
new CfnOutput(stack, 'IntegratorConsoleUrl', {
  value: integratorConsoleApp.defaultDomain,
});

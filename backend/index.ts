import 'source-map-support/register';
import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import {
  BlockPublicAccess,
  Bucket,
  BucketAccessControl,
  BucketEncryption,
} from 'aws-cdk-lib/aws-s3';
import { Effect, PolicyStatement, StarPrincipal } from 'aws-cdk-lib/aws-iam';
import { BuildSpec } from 'aws-cdk-lib/aws-codebuild';
import { Repository } from 'aws-cdk-lib/aws-codecommit';
import * as amplify from '@aws-cdk/aws-amplify-alpha';

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
    blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
    publicReadAccess: true,
  },
);
artifactStorage.addToResourcePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    principals: [new StarPrincipal()],
    actions: ['s3:GetObject'],
    resources: [`${artifactStorage.bucketArn}/*`],
  }),
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
new CfnOutput(stack, 'IntegratorConsoleUrl', { value: integratorConsoleApp.defaultDomain });

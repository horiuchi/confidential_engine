import "source-map-support/register";
import { App, CfnOutput, Stack } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import {
  BlockPublicAccess,
  Bucket,
  BucketAccessControl,
  BucketEncryption,
} from "aws-cdk-lib/aws-s3";
import { Effect, PolicyStatement, StarPrincipal } from "aws-cdk-lib/aws-iam";

const app = new App();

const stack = new Stack(app, "ConfidentialEngineBackendStack");

// DynamoDB
const appListTable = new Table(stack, "ConfidentialEngine-Apps", {
  tableName: "ConfidentialEngine-Apps",
  partitionKey: {
    name: "appId",
    type: AttributeType.STRING,
  },
  billingMode: BillingMode.PAY_PER_REQUEST,
});

const requestListTable = new Table(stack, "ConfidentialEngine-Requests", {
  tableName: "ConfidentialEngine-Requests",
  partitionKey: {
    name: "requestId",
    type: AttributeType.STRING,
  },
  billingMode: BillingMode.PAY_PER_REQUEST,
});

// S3
const appRepository = new Bucket(stack, "ConfidentialEngine-AppRepository", {
  accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
  encryption: BucketEncryption.S3_MANAGED,
  blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
});

const artifactStorage = new Bucket(stack, "ConfidentialEngine-ArtifactStorage", {
  blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
  publicReadAccess: true,
});
artifactStorage.addToResourcePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    principals: [new StarPrincipal()],
    actions: ["s3:GetObject"],
    resources: [`${artifactStorage.bucketArn}/*`],
  })
);

// Exports
new CfnOutput(stack, "AppListTableName", { value: appListTable.tableName });
new CfnOutput(stack, "RequestListTableName", { value: requestListTable.tableName });
new CfnOutput(stack, "RepositoryArn", { value: appRepository.bucketArn });
new CfnOutput(stack, "StorageArn", { value: artifactStorage.bucketArn });

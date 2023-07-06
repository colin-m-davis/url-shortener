import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class UrlShortenerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const table = new dynamodb.Table(this, 'Table', {
      partitionKey: { name: 'id', type:dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const generateLambda = new lambda.Function(this, 'generate', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('resources'),
      handler: 'lambda.generate',
      environment: {
        TABLE_NAME: table.tableName,
      }
    });

    table.grantReadWriteData(generateLambda);

    const api = new apigateway.RestApi(this, "widgets-api", {
      restApiName: "URL Shortener Service",
      description: "This service generates and serves shortened URLs."
    });

    const generateResource = api.root.addResource('gen');

    const generateIntegration = new apigateway.LambdaIntegration(generateLambda, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }'}
    });

    generateResource.addMethod("POST", generateIntegration);
  }
}

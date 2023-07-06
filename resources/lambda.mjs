import { createHash } from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export async function generate(event) {
    const json = JSON.parse(event.body);
    const userUrl = json.userUrl;

    const shaSum = createHash('sha256');
    shaSum.update(userUrl);
    const fullHash = shaSum.digest('hex');
    const partialHash = fullHash.slice(0, 8);

    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);

    const command = new UpdateCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
            id: partialHash,
        },
        UpdateExpression: 'SET user_url = :user_url',
        ExpressionAttributeValues: {
            ":user_url": userUrl,
        },
    });

    const response = await docClient.send(command);
    console.log(response);
    return {
        statusCode: 200,
        body:   partialHash
    };
}

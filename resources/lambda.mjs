import { createHash } from 'node:crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

function getId(s) {
    const shaSum = createHash('sha256');
    shaSum.update(s);
    const fullHash = shaSum.digest('hex');
    return fullHash.slice(0, 8);
}

// generate a new shortened URL
export async function generate(event) {
    const json = JSON.parse(event.body);
    const userUrl = json.userUrl;
    const id = getId(userUrl);

    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);

    const command = new UpdateCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
            id: id,
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
        body: id
    };
}

// go to a previously generated shortened URL
export async function go(event) {
    const pathChunks = event.path.split("/");
    const id = pathChunks[2];

    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);

    const command = new GetCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
            'id': id,
        },
        ProjectionExpression: 'user_url',
    });

    const response = await docClient.send(command);
    const destination = response.Item.user_url;
    return {
        statusCode: 302,
        headers: {
            Location: destination,
        }
    }
}

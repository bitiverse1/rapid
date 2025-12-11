import {
  DynamoDBClient,
  DynamoDBClientConfig,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { DatabaseError, NotFoundError } from '@rapid/errors';

export interface DynamoDBServiceConfig {
  region?: string;
  endpoint?: string;
  tableName: string;
}

export class DynamoDBService {
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(config: DynamoDBServiceConfig) {
    const clientConfig: DynamoDBClientConfig = {
      region: config.region || process.env.AWS_REGION || 'us-east-1',
    };

    if (config.endpoint) {
      clientConfig.endpoint = config.endpoint;
    }

    const ddbClient = new DynamoDBClient(clientConfig);
    this.client = DynamoDBDocumentClient.from(ddbClient);
    this.tableName = config.tableName;
  }

  /**
   * Get an item by primary key
   */
  async get<T>(key: Record<string, unknown>): Promise<T> {
    try {
      const result = await this.client.send(
        new GetCommand({
          TableName: this.tableName,
          Key: key,
        })
      );

      if (!result.Item) {
        throw new NotFoundError('Item', JSON.stringify(key));
      }

      return result.Item as T;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Failed to get item from DynamoDB', {
        error: String(error),
      });
    }
  }

  /**
   * Put an item (create or replace)
   */
  async put<T>(item: T): Promise<void> {
    try {
      await this.client.send(
        new PutCommand({
          TableName: this.tableName,
          Item: item as Record<string, unknown>,
        })
      );
    } catch (error) {
      throw new DatabaseError('Failed to put item to DynamoDB', {
        error: String(error),
      });
    }
  }

  /**
   * Update an item
   */
  async update<T>(
    key: Record<string, unknown>,
    updates: Partial<T>
  ): Promise<T> {
    try {
      const updateExpressionParts: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, unknown> = {};

      Object.entries(updates).forEach(([field, value], index) => {
        const attrName = `#attr${index}`;
        const attrValue = `:val${index}`;
        updateExpressionParts.push(`${attrName} = ${attrValue}`);
        expressionAttributeNames[attrName] = field;
        expressionAttributeValues[attrValue] = value;
      });

      const result = await this.client.send(
        new UpdateCommand({
          TableName: this.tableName,
          Key: key,
          UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: 'ALL_NEW',
        })
      );

      return result.Attributes as T;
    } catch (error) {
      throw new DatabaseError('Failed to update item in DynamoDB', {
        error: String(error),
      });
    }
  }

  /**
   * Delete an item
   */
  async delete(key: Record<string, unknown>): Promise<void> {
    try {
      await this.client.send(
        new DeleteCommand({
          TableName: this.tableName,
          Key: key,
        })
      );
    } catch (error) {
      throw new DatabaseError('Failed to delete item from DynamoDB', {
        error: String(error),
      });
    }
  }

  /**
   * Query items
   */
  async query<T>(params: {
    keyConditionExpression: string;
    expressionAttributeValues: Record<string, unknown>;
    expressionAttributeNames?: Record<string, string>;
    limit?: number;
  }): Promise<T[]> {
    try {
      const result = await this.client.send(
        new QueryCommand({
          TableName: this.tableName,
          KeyConditionExpression: params.keyConditionExpression,
          ExpressionAttributeValues: params.expressionAttributeValues,
          ExpressionAttributeNames: params.expressionAttributeNames,
          Limit: params.limit,
        })
      );

      return (result.Items || []) as T[];
    } catch (error) {
      throw new DatabaseError('Failed to query items from DynamoDB', {
        error: String(error),
      });
    }
  }

  /**
   * Scan all items (use with caution - expensive operation)
   */
  async scan<T>(limit?: number): Promise<T[]> {
    try {
      const result = await this.client.send(
        new ScanCommand({
          TableName: this.tableName,
          Limit: limit,
        })
      );

      return (result.Items || []) as T[];
    } catch (error) {
      throw new DatabaseError('Failed to scan items from DynamoDB', {
        error: String(error),
      });
    }
  }
}

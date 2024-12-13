import { Handler } from '@netlify/functions';
import { getCollection } from './mongodb';
import type { MongoDBClient } from '../../src/types/mongodb';

const handler: Handler = async (event) => {
  try {
    const collection = await getCollection('clients');

    switch (event.httpMethod) {
      case 'POST': {
        // Sync data to cloud
        const { userId, data } = JSON.parse(event.body || '{}');
        
        // Prepare bulk operations
        const operations = data.map((client: MongoDBClient) => ({
          updateOne: {
            filter: { id: client.id },
            update: { 
              $set: { 
                ...client,
                userId,
                lastModified: new Date().toISOString()
              }
            },
            upsert: true
          }
        }));

        // Execute bulk write
        await collection.bulkWrite(operations);

        return {
          statusCode: 200,
          body: JSON.stringify({ 
            message: 'Data synced successfully',
            timestamp: new Date().toISOString()
          })
        };
      }

      case 'GET': {
        // Get updates from cloud
        const { userId, lastSync } = event.queryStringParameters || {};
        
        const query = {
          userId,
          lastModified: { $gt: lastSync || new Date(0).toISOString() }
        };

        const updates = await collection.find(query).toArray();

        return {
          statusCode: 200,
          body: JSON.stringify({
            data: updates,
            timestamp: new Date().toISOString()
          })
        };
      }

      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ message: 'Method not allowed' })
        };
    }
  } catch (error: any) {
    console.error('Sync function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Internal server error',
        error: error.message 
      })
    };
  }
}

export { handler };

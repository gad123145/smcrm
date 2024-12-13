import { Handler } from '@netlify/functions';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = 'client-haven';

const handler: Handler = async (event) => {
  if (!uri) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Database configuration missing' })
    };
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    switch (event.httpMethod) {
      case 'POST': {
        // Sync data to cloud
        const { userId, data } = JSON.parse(event.body || '{}');
        const collection = db.collection('clients');
        
        // Update or insert each client
        const operations = data.map((client: any) => ({
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
        const collection = db.collection('clients');
        
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
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message })
    };
  } finally {
    await client.close();
  }
}

export { handler };

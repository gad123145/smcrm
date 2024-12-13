import { MongoClient } from 'mongodb';
import type { MongoDBClient } from '../../src/types/mongodb';

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function getCollection(collectionName: string) {
  const client = await connectToDatabase();
  const db = client.db('client-haven');
  return db.collection<MongoDBClient>(collectionName);
}

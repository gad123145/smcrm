export interface MongoDBClient {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  facebook?: string;
  country?: string;
  city?: string;
  project?: string;
  status: string;
  assigned_to?: string;
  userId: string;
  lastModified: string;
  lastSynced?: string;
}

export interface MongoDBFavorite {
  id: string;
  clientId: string;
  userId: string;
  createdAt: string;
}

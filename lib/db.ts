import { Db, MongoClient } from "mongodb";

const DB_NAME = "om_divine";

/**
 * Cache the connection promise on globalThis so Next's dev HMR (and multiple
 * route handlers) reuse a single MongoClient instead of opening a new pool on
 * every request / reload.
 */
const globalForMongo = globalThis as unknown as {
  __omMongo?: Promise<MongoClient>;
};

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.DB_URL;
  if (!uri) {
    throw new Error("DB_URL is not set — add it to .env (MongoDB connection string).");
  }
  if (!globalForMongo.__omMongo) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
    globalForMongo.__omMongo = client.connect();
  }
  return globalForMongo.__omMongo;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(DB_NAME);
}

import { getDb } from "./db";

const COLL = "settings";
const EMAIL_KEY = "email";

export interface EmailConfig {
  provider: "google";
  email: string;
  refreshToken: string;
  updatedAt: string;
}

export async function getEmailConfig(): Promise<EmailConfig | null> {
  const db = await getDb();
  const doc = await db.collection(COLL).findOne({ _id: EMAIL_KEY as unknown as object });
  if (!doc || !doc.refreshToken) return null;
  return {
    provider: "google",
    email: doc.email,
    refreshToken: doc.refreshToken,
    updatedAt: doc.updatedAt,
  };
}

export async function saveEmailConfig(email: string, refreshToken: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLL).updateOne(
    { _id: EMAIL_KEY as unknown as object },
    {
      $set: {
        provider: "google",
        email,
        refreshToken,
        updatedAt: new Date().toISOString(),
      },
    },
    { upsert: true }
  );
}

export async function clearEmailConfig(): Promise<void> {
  const db = await getDb();
  await db.collection(COLL).deleteOne({ _id: EMAIL_KEY as unknown as object });
}

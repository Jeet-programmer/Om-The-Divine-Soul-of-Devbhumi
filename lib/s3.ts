import { S3Client } from "@aws-sdk/client-s3";

export const S3_BUCKET = process.env.BucketName || process.env.AWS_BUCKET_NAME || "";
export const S3_REGION = process.env.AWS_REGION || "ap-south-1";

const globalForS3 = globalThis as unknown as { __omS3?: S3Client };

export function getS3(): S3Client {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    throw new Error("AWS credentials are not set (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY).");
  }
  if (!S3_BUCKET) {
    throw new Error("S3 bucket name is not set (BucketName).");
  }
  if (!globalForS3.__omS3) {
    globalForS3.__omS3 = new S3Client({
      region: S3_REGION,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return globalForS3.__omS3;
}

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getS3, S3_BUCKET } from "@/lib/s3";

export const runtime = "nodejs";

/**
 * Public proxy for S3-stored images. Streams the object back so images load on
 * any bucket configuration (no public-access or presigned URLs required).
 * Path: /api/images/<key...>  e.g. /api/images/rooms/123-photo.jpg
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key } = await params;
    const Key = key.map((k) => decodeURIComponent(k)).join("/");

    const obj = await getS3().send(new GetObjectCommand({ Bucket: S3_BUCKET, Key }));
    if (!obj.Body) {
      return new Response("Not found", { status: 404 });
    }
    const bytes = await obj.Body.transformToByteArray();

    return new Response(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": obj.ContentType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e) {
    const msg = (e as Error).name === "NoSuchKey" ? "Not found" : (e as Error).message;
    const status = (e as Error).name === "NoSuchKey" ? 404 : 500;
    return new Response(msg, { status });
  }
}

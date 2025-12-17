/**
 * Replace internal MinIO hostname with public URL
 * Converts minio-api:9000 to localhost:9000 or configured public URL
 */
export function getPublicImageUrl(url: string | null | undefined): string {
  if (!url) return "/placeholder.png";

  // Replace internal hostname with public URL
  const MINIO_PUBLIC_URL =
    process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000";

  // Replace minio-api:9000 with public URL
  const publicUrl = url.replace(/http:\/\/minio-api:9000/g, MINIO_PUBLIC_URL);

  return publicUrl;
}


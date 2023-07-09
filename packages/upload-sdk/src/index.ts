import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type Config = {
  R2_ACCOUNT_ID: string;
  R2_ACCESS_KEY: string;
  R2_SECRET_KEY: string;
};

export class Client {
  private s3: S3Client;

  constructor(config: Config) {
    this.s3 = new S3Client({
      region: "auto",
      endpoint: `https://${config.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.R2_ACCESS_KEY,
        secretAccessKey: config.R2_SECRET_KEY,
      },
    });
  }

  async presign(params: {
    bucketName: string;
    files: Array<{ name: string; type: string }>;
  }) {
    const files = await Promise.all(
      params.files.map(async (f) => {
        const key = `${crypto.randomUUID()}_${f.name}`;
        return {
          name: f.name,
          key,
          presignedUrl: await getSignedUrl(
            this.s3,
            new PutObjectCommand({
              Bucket: params.bucketName,
              Key: key,
              ContentType: f.type,
            }),
            {
              expiresIn: 60 * 5, // 5 minutes
            }
          ),
        };
      })
    );

    return { files };
  }
}

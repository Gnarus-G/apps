import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { BasicConfig, MoreConfig, PresignedUploads } from "./types";

export { uploadFiles } from "./client";

export class Bucket {
  private s3: S3Client;

  constructor(config: BasicConfig) {
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

  async deleteByFileUrl(url: URL, bucketName: string) {
    const key = new URL(url).pathname.slice(1);

    const input = {
      Bucket: bucketName,
      Key: key,
    };

    const command = new DeleteObjectCommand(input);

    const response = await this.s3.send(command);

    console.log("deleted file", key, {
      metadata: response.$metadata,
    });
  }

  createUploadHandler(config: MoreConfig) {
    return async (request: Request): Promise<Response> => {
      const res = requestSchema.safeParse(await request.json());

      if (!res.success) {
        return new Response(
          JSON.stringify({
            message: "bad request data",
            errors: res.error.formErrors.fieldErrors,
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      return new Response(
        JSON.stringify(await prepareUploads(this, config, res.data.files)),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    };
  }
}

const filesChema = z.array(
  z.object({
    name: z.string().min(1),
    type: z.string().min(1),
  })
);

const requestSchema = z.object({
  files: filesChema,
});

async function prepareUploads(
  client: Bucket,
  config: MoreConfig,
  files: z.infer<typeof filesChema>
): Promise<PresignedUploads> {
  const res = await client.presign({
    bucketName: config.R2_BUCKET_NAME,
    files: files,
  });

  const fileData = res.files.map((f) => ({
    name: f.name,
    url: `${config.R2_BUCKET_URL}/${f.key}`,
    key: f.key,
    uploadUrl: f.presignedUrl,
  }));

  return Object.fromEntries(fileData.map(({ name, ...f }) => [name, f]));
}

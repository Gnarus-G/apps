export type BasicConfig = {
  R2_ACCOUNT_ID: string;
  R2_ACCESS_KEY: string;
  R2_SECRET_KEY: string;
};

export type MoreConfig = {
  R2_BUCKET_NAME: string;
  R2_BUCKET_URL: string;
};

export type PresignedUploads = Record<
  string, // file name
  {
    url: string;
    key: string;
    uploadUrl: string;
  }
>;

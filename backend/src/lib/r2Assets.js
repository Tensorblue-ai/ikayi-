const { GetObjectCommand, PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

function requiredEnv(name) {
  const value = process.env[name] || "";

  if (!value.trim()) {
    throw new Error(`${name} is required`);
  }

  return value.trim();
}

function getR2Config() {
  const accountId = requiredEnv("R2_ACCOUNT_ID");

  return {
    accountId,
    endpoint: (process.env.R2_ENDPOINT || `https://${accountId}.r2.cloudflarestorage.com`).replace(/\/+$/, ""),
    accessKeyId: requiredEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requiredEnv("R2_SECRET_ACCESS_KEY"),
    bucket: requiredEnv("R2_BUCKET"),
  };
}

function createR2Client(config = getR2Config()) {
  return new S3Client({
    region: "auto",
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

async function uploadFileToR2({ client, bucket, key, body, contentType }) {
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
}

async function getObjectFromR2({ client, bucket, key }) {
  return client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}

module.exports = {
  createR2Client,
  getObjectFromR2,
  getR2Config,
  uploadFileToR2,
};

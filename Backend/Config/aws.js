require('dotenv').config(); //SI
const { S3Client, HeadBucketCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const getS3Config = () => {
  const config = {
    region: process.env.AWS_REGION || 'us-east-2',
    bucket: process.env.S3_BUCKET_NAME || 'marketplacefwd',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };

  const missing = [];
  if (!config.accessKeyId) missing.push('AWS_ACCESS_KEY_ID');
  if (!config.secretAccessKey) missing.push('AWS_SECRET_ACCESS_KEY');
  if (!config.region) missing.push('AWS_REGION');
  if (!config.bucket) missing.push('S3_BUCKET_NAME');

  if (missing.length) {
    const error = new Error(`Faltan variables de entorno para S3: ${missing.join(', ')}`);
    error.code = 'S3_CONFIG_MISSING';
    throw error;
  }

  return config;
};

const describeS3Error = (error) => ({
  name: error?.name,
  code: error?.Code || error?.code,
  message: error?.message,
  status: error?.$metadata?.httpStatusCode,
  requestId: error?.$metadata?.requestId,
});

const createS3Client = () => {
  const config = getS3Config();
  return new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
};

// Configuración del cliente S3 leyendo automáticamente del .env:
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const testS3Connection = async () => {
  const { bucket, region, accessKeyId } = getS3Config();
  try {
    const client = createS3Client();
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log(`✅ Conexión a AWS S3 exitosa. Bucket disponible: ${bucket} (${region})`);
  } catch (error) {
    console.error(`❌ Error al conectar con AWS S3 bucket "${bucket}" (${region}).`);
    console.error('   Access key usada:', `${accessKeyId.slice(0, 4)}...${accessKeyId.slice(-4)}`);
    console.error('   Detalle:', describeS3Error(error));
    console.error('   Revisa que la access key exista, pertenezca a la cuenta correcta, tenga permisos s3:HeadBucket/s3:PutObject y que bucket/región coincidan.');
    process.exitCode = 1;
  }
};

// Si ejecutamos este archivo directamente con "node aws.js" probará la conexión
if (require.main === module) {
  testS3Connection();
}

const uploadFileToS3 = async (file, folder = 'uploads') => {
  if (!file) throw new Error('No se proporcionó archivo');

  const { bucket, region } = getS3Config();
  const fileExt = path.extname(file.originalname);
  const fileName = `${folder}/${uuidv4()}${fileExt}`;
  
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);

  return `https://${bucket}.s3.${region}.amazonaws.com/${fileName}`;
};

module.exports = {
  s3Client,
  testS3Connection,
  uploadFileToS3,
  describeS3Error,
};

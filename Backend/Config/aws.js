require('dotenv').config(); //SI 
const { S3Client, HeadBucketCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configuración del cliente S3 leyendo automáticamente del .env:
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const testS3Connection = async () => {
  const bucket = process.env.S3_BUCKET_NAME || 'marketplacefwd';
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log(`✅ Conexión a AWS S3 exitosa. Bucket disponible: ${bucket}`);
  } catch (error) {
    console.error(`❌ Error al conectar con AWS S3 bucket "${bucket}":`, error.message);
  }
};

// Si ejecutamos este archivo directamente con "node aws.js" probará la conexión
if (require.main === module) {
  testS3Connection();
}

const uploadFileToS3 = async (file, folder = 'uploads') => {
  if (!file) throw new Error('No se proporcionó archivo');

  const bucket = process.env.S3_BUCKET_NAME || 'marketplacefwd';
  const fileExt = path.extname(file.originalname);
  const fileName = `${folder}/${uuidv4()}${fileExt}`;
  
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);

  const region = process.env.AWS_REGION || 'us-east-2';
  return `https://${bucket}.s3.${region}.amazonaws.com/${fileName}`;
};

module.exports = {
  s3Client,
  testS3Connection,
  uploadFileToS3,
};

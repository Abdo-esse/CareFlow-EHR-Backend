import { Client } from 'minio';

const minioClient = new Client({
  endPoint: 'minio', // nom du conteneur docker
  port: parseInt(process.env.MINIO_API_PORT, 10) ,
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER,
  secretKey: process.env.MINIO_ROOT_PASSWORD,
});

const initMinio = async () => {
  const bucketName = process.env.MINIO_BUCKET || 'careflow-documents';

  try {
    const exists = await minioClient.bucketExists(bucketName);

    if (!exists) {
      await minioClient.makeBucket(bucketName);
      console.log(`Bucket MinIO créé : ${bucketName}`);
    } else {
      console.log(`Bucket MinIO déjà existant : ${bucketName}`);
    }
  } catch (error) {
    console.error('Erreur MinIO :', error.message);
  }
};

export { minioClient, initMinio };

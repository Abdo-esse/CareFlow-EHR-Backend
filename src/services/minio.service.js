// services/minioUpload.service.js
import { minioClient } from "../config/minio.js";
import crypto from "crypto";


export const uploadToMinio = async ({ file, clinicId, patientId = null, folder = "" }) => {
  const bucketName = process.env.MINIO_BUCKET || "careflow-documents";
  const publicBaseUrl = process.env.MINIO_PUBLIC_URL || "http://localhost:9000";

  if (!file || !clinicId) {
    throw new Error("Paramètres manquants : file et clinicId sont requis");
  }

  // Construction dynamique du chemin (dossier)
  let objectPath = `clinic-${clinicId}`;

  if (patientId) objectPath += `/patients/patient-${patientId}`;
  if (folder) objectPath += `/${folder}`;

  const fileName = `${crypto.randomUUID()}-${file.originalname}`;
  const fullPath = `${objectPath}/${fileName}`;

  // Upload vers MinIO
  await minioClient.putObject(bucketName, fullPath, file.buffer, {
    "Content-Type": file.mimetype,
  });

  // URL publique du fichier
  const fileUrl = `${publicBaseUrl}/${bucketName}/${fullPath}`;

  return {
    fileName,
    fileType: file.mimetype,
    fileUrl,
  };
};

// seedSpecialties.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Specialty from "../models/Specialty.js";

dotenv.config();

// ⚙️ Connexion à la base de données
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/your_database_name";

const specialties = [
  {
    name: "Cardiologie",
    description: "Spécialité médicale qui traite les maladies du cœur et du système circulatoire."
  },
  {
    name: "Dermatologie",
    description: "Étude et traitement des affections de la peau, des cheveux et des ongles."
  },
  {
    name: "Pédiatrie",
    description: "Prise en charge médicale des enfants et des adolescents."
  },
  {
    name: "Gynécologie",
    description: "Suivi médical des femmes et traitement des troubles du système reproducteur féminin."
  },
  {
    name: "Neurologie",
    description: "Étude et traitement des troubles du système nerveux central et périphérique."
  },
  {
    name: "Orthopédie",
    description: "Spécialité consacrée aux affections de l'appareil locomoteur (os, muscles, articulations)."
  },
  {
    name: "Ophtalmologie",
    description: "Diagnostic et traitement des maladies des yeux et des troubles de la vision."
  },
  {
    name: "Psychiatrie",
    description: "Étude, diagnostic et traitement des maladies mentales et émotionnelles."
  },
  {
    name: "Radiologie",
    description: "Utilisation de techniques d’imagerie médicale pour le diagnostic et le traitement."
  },
  {
    name: "Médecine générale",
    description: "Soins médicaux de première ligne couvrant une large gamme de problèmes de santé."
  }
];

const seedSpecialties = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connecté à MongoDB");

    // Nettoyer la collection avant insertion (facultatif)
    await Specialty.deleteMany({});
    console.log("🧹 Anciennes données supprimées");

    // Insérer les nouvelles spécialités
    await Specialty.insertMany(specialties);
    console.log("🌱 Spécialités insérées avec succès !");
  } catch (error) {
    console.error("❌ Erreur de seeding :", error);
  } finally {
    mongoose.connection.close();
  }
};

seedSpecialties();

import mongoose from "mongoose";
import dotenv from "dotenv";
import Role from "../models/Role.js";
import Permission from "../models/Permission.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const permissions = [
    // 🌍 SuperAdmin / SaaS
    {name: "*", description: "Accès complet à toutes les fonctionnalités"},

  // 🏥 ClinicAdmin
  { name: "manage_clinic_users", description: "Créer et gérer les utilisateurs de la clinique" },
  { name: "manage_roles", description: "Gérer les rôles internes de la clinique" },
  { name: "view_reports", description: "Voir les rapports internes" },
  { name: "configure_clinic", description: "Configurer la clinique" },

  // 🩺 Consultation & patient
  { name: "create_consultation", description: "Créer une consultation" },
  { name: "view_consultation", description: "Voir les consultations" },
  { name: "edit_consultation", description: "Modifier une consultation" },
  { name: "create_patient", description: "Créer un patient" },
  { name: "view_patient", description: "Voir les informations du patient" },

  // 💊 Prescription
  { name: "create_prescription", description: "Créer une prescription" },
  { name: "view_prescription", description: "Voir les prescriptions" },
  { name: "update_prescription_status", description: "Mettre à jour le statut d’une prescription" },

  // 🧪 Laboratoire
  { name: "create_lab_order", description: "Créer un ordre de laboratoire" },
  { name: "upload_lab_report", description: "Uploader un rapport de laboratoire" },
  { name: "view_lab_results", description: "Voir les résultats de laboratoire" },

  // 📂 Fichiers médicaux
  { name: "upload_file", description: "Uploader un fichier médical" },
  { name: "view_file", description: "Voir les fichiers médicaux" },
];

const roles = {
  SuperAdmin: ["*"],
  ClinicAdmin: [
    "manage_clinic_users",
    "manage_roles",
    "view_reports",
    "configure_clinic",
    "create_patient",
    "view_patient",
  ],
  Doctor: [
    "create_consultation",
    "view_consultation",
    "create_prescription",
    "view_prescription",
    "create_lab_order",
    "view_lab_results",
    "upload_file",
    "view_file",
  ],
  Nurse: [
    "view_consultation",
    "view_patient",
    "upload_file",
  ],
  Pharmacist: [
    "view_prescription",
    "update_prescription_status",
  ],
  LabManager: [
    "create_lab_order",
    "upload_lab_report",
    "view_lab_results",
  ],
  Patient: [
    "view_consultation",
    "view_prescription",
    "view_lab_results",
    "view_file",
  ],
  Secretary: [
    "view_patient",
    "create_patient",
    "view_consultation",
  ],
};

const seedRolesAndPermissions = async () => {
  try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connecté à MongoDB");

        // Supprimer anciens rôles et permissions
        await Role.deleteMany();
        await Permission.deleteMany();

        // Créer permissions
        const createdPermissions = await Permission.insertMany(permissions);
        console.log(`✅ ${createdPermissions.length} permissions créées`);

        // Créer rôles avec leurs permissions
        const roleDocs = [];
        for (const [roleName, permNames] of Object.entries(roles)) {
            const rolePerms = createdPermissions.filter((p) => permNames.includes(p.name));
            const roleDoc = await Role.create({
                name: roleName,
                permissions: rolePerms.map((p) => p._id),
            });
            roleDocs.push(roleDoc);
            console.log(`➡️  Rôle ${roleName} créé avec ${rolePerms.length} permissions`);
        }

        // Créer un SuperAdmin par défaut
        const superAdminRole = roleDocs.find(r => r.name === "SuperAdmin");
        const existingAdmin = await User.findOne({ email: "superadmin@careflow.com" });
        const plainPassword = "SuperAdmin123!";
        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(plainPassword, salt);
        await User.create({
            firstName: "Super",
            lastName: "Admin",
            email: "superadmin@careflow.com",
            password: hashedPassword, // à changer en mot de passe hashé en prod
            roleId: superAdminRole._id,
            isActive: true,
        });
        console.log("🎉 SuperAdmin créé : superadmin@careflow.com / SuperAdmin123!");
        }

        console.log("🎉 Seed terminé avec succès !");
        process.exit(0);

    } catch (err) {
        console.error("❌ Erreur lors du seed :", err);
        process.exit(1);
    }
};

seedRolesAndPermissions();

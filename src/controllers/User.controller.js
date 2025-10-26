import { getUser, updateUser, getPaginatedUsers, deleteUser} from "../services/User.service.js";
import { createPatient, createDoctor, createNurse,createSecretary, createUser} from "../services/index.js";
import {
  doctorValidationSchema,
  patientValidationSchema,
  nurseValidationSchema,
} from "../validators/index.js";
import { AppError, BadRequestError } from "../core/AppError.js";

export const createUserController = async (req, res, next) => {
  try {
    const userBody = req.body;
    const { role } = userBody;
    let createdUser = null;
    let relatedEntity = null;

    // 1️⃣ Créer l’utilisateur
    createdUser = await createUser(userBody);
    if (!createdUser) throw new BadRequestError("Erreur lors de la création de l'utilisateur");

    try {
      // 2️⃣ Créer l’entité selon le rôle
      switch (role) {
        case "Doctor": {
          const { error, value } = doctorValidationSchema.validate({ ...req.body.doctorData, userId: createdUser._id.toString() } || {});
          if (error) throw new BadRequestError("Validation médecin : " + error.details.map(d => d.message).join(", "));
          relatedEntity = await createDoctor({ ...value, userId: createdUser._id });
          break;
        }

        case "Patient": {
          const { error, value } = patientValidationSchema.validate({ ...req.body.patientData, userId: createdUser._id.toString() } || {});
          if (error) throw new BadRequestError("Validation patient : " + error.details.map(d => d.message).join(", "));
          relatedEntity = await createPatient({ ...value, userId: createdUser._id });
          break;
        }

        case "Nurse": {
          const { error, value } = nurseValidationSchema.validate({ ...req.body.nurseData, userId: createdUser._id.toString() } || {});
          if (error) throw new BadRequestError("Validation infirmière : " + error.details.map(d => d.message).join(", "));
          relatedEntity = await createNurse({ ...value, userId: createdUser._id });
          break;
        }

        case "Secretary": {
          const value = req.body.secretaryData || {};
          relatedEntity = await createSecretary({ ...value, userId: createdUser._id });
          break;
        }

        default:
          throw new BadRequestError("Rôle non valide");
      }

      // 3️⃣ Si tout se passe bien
      res.status(201).json({
        message: `${role} créé avec succès`,
        user: createdUser,
        relatedEntity,
      });

    } catch (error) {
      // ❌ 4️⃣ Rollback manuel : supprimer le user créé si la 2ᵉ étape échoue
      console.error("Erreur lors de la création de l’entité liée :", error.message);
      await deleteUser(createdUser._id);
      throw error;
    }

  } catch (error) {
    next(error);
  }
};


export const updateUserController = async (req, res) => {
    try {
        const updatedUser = await updateUser(req.params.id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const deleteUserController = async (req, res) => {
    try {
        const deletedUser = await deleteUser(req.params.id);    
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPaginatedUsersController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const paginatedUsers = await getPaginatedUsers(page, limit);
        res.status(200).json(paginatedUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
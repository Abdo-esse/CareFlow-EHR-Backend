import { getUser, updateUser, getPaginatedUsers, deleteUser} from "../services/User.service.js";
import { createPatient, createDoctor, createNurse,createSecretary, createUser} from "../services/index.js";
import { updateDoctor, updatePatient, updateNurse, updateSecretary } from "../services/entity.service.js";
import { deleteDoctor, deletePatient, deleteNurse, deleteSecretary } from "../services/entity.service.js";
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

    createdUser = await createUser(userBody);
    if (!createdUser) throw new BadRequestError("Erreur lors de la création de l'utilisateur");

    try {
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

      res.status(201).json({
        message: `${role} créé avec succès`,
        user: createdUser,
        relatedEntity,
      });

    } catch (error) {

      console.error("Erreur lors de la création de l’entité liée :", error.message);
      await deleteUser(createdUser._id);
      throw error;
    }

  } catch (error) {
    next(error);
  }
};


export const updateUserController = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    const updatedUser = await updateUser(userId, req.body);

    let updatedEntity = null;
    switch(role){
      case "Doctor":
        if(req.body.doctorData){
          const { error, value } = doctorValidationSchema.validate(req.body.doctorData);
          if(error) throw new BadRequestError(error.details.map(d=>d.message).join(", "));
          updatedEntity = await updateDoctor(userId, value);
        }
        break;
      case "Patient":
        if(req.body.patientData){
          const { error, value } = patientValidationSchema.validate(req.body.patientData);
          if(error) throw new BadRequestError(error.details.map(d=>d.message).join(", "));
          updatedEntity = await updatePatient(userId, value);
        }
        break;
      case "Nurse":
        if(req.body.nurseData){
          const { error, value } = nurseValidationSchema.validate(req.body.nurseData);
          if(error) throw new BadRequestError(error.details.map(d=>d.message).join(", "));
          updatedEntity = await updateNurse(userId, value);
        }
        break;
      case "Secretary":
        if(req.body.secretaryData){
          updatedEntity = await updateSecretary(userId, req.body.secretaryData);
        }
        break;
    }

    res.status(200).json({
      success: true,
      message: "Utilisateur mis à jour",
      user: updatedUser,
      relatedEntity: updatedEntity
    });

  } catch(error){
    next(error);
  }
};

export const deleteUserController = async (req, res, next) => {
  try {
    const user = await getUser(req.params.id);
    if (!user) throw new NotFoundError("Utilisateur non trouvé");
    
    let deletedEntity = null;
    switch (user.role) {
      case "Doctor": deletedEntity = await deleteDoctor(user._id); break;
      case "Patient": deletedEntity = await deletePatient(user._id); break;
      case "Nurse": deletedEntity = await deleteNurse(user._id); break;
      case "Secretary": deletedEntity = await deleteSecretary(user._id); break;
    }

    const deletedUser = await deleteUser(user._id);

    res.status(200).json({ 
      success: true,
      message: "Utilisateur supprimé", 
      user: deletedUser, 
      relatedEntity: deletedEntity 
    });
  } catch (error) {
    next(error);
  }
};

export const getPaginatedUsersController = async (req, res) => {
    try {
        const currentUser = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const clinicId = currentUser?.clinicId || null;
        const paginatedUsers = await getPaginatedUsers(page, limit, clinicId);
        res.status(200).json(paginatedUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

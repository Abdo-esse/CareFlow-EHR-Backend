import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Nurse from "../models/Nurse.js";
import Secretary from "../models/Secretary.js";

// ------------- UPDATE ENTITÉS ----------------
export const updateDoctor = async (userId, data) => await Doctor.findOneAndUpdate({ userId }, data, { new: true });
export const updatePatient = async (userId, data) => await Patient.findOneAndUpdate({ userId }, data, { new: true });
export const updateNurse = async (userId, data) => await Nurse.findOneAndUpdate({ userId }, data, { new: true });
export const updateSecretary = async (userId, data) => await Secretary.findOneAndUpdate({ userId }, data, { new: true });

// ------------- DELETE ENTITÉS ----------------
export const deleteDoctor = async (userId) => await Doctor.findOneAndDelete({ userId });
export const deletePatient = async (userId) => await Patient.findOneAndDelete({ userId });
export const deleteNurse = async (userId) => await Nurse.findOneAndDelete({ userId });
export const deleteSecretary = async (userId) => await Secretary.findOneAndDelete({ userId });

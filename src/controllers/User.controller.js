import { getUser, createUser, updateUser, getPaginatedUsers, deleteUser} from "../services/User.service.js";

export const getUserController = async (req, res) => {
    try {
        const user = await getUser(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createUserController = async (req, res, next) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: newUser
    });
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
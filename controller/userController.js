const userFileOps = require('../helpers/userFileOps');

const getAllUsers = async (req, res) => {
    const data = await userFileOps.readUsers();
    res.json(data.users);
};

const addUser = async (req, res) => {
    if (!req.body.name ) {
        throw new Error('Name  required');
    }
    const newUser = await userFileOps.addUser(req.body);
    res.status(201).json({
        message: 'User added successfully',
        user: newUser
    });
};

const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) throw new Error('User ID is required');
    await userFileOps.updateUser(id, req.body);
    res.json({
        message: 'User updated successfully',
        user: req.body
    });
};

const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) throw new Error('User ID is required');
    await userFileOps.deleteUser(id);
    res.json({ message: 'User deleted successfully' });
};

const getUserById = async (req, res) => {
    const id = req.params.id;
    const user = await userFileOps.getUserById(id);
    res.json(user);
};

module.exports = {
    getAllUsers,
    addUser,
    updateUser,
    deleteUser,
    getUserById
};
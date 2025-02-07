const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../data/users.json');
const {generateUniqueId} = require('../utils/idGenerator');
const readUsers = async () => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const parsedData = JSON.parse(data);
        return parsedData.users ? parsedData : { users: [] };
    } catch (error) {
        console.error('Error reading users file', error);
        throw new Error('Failed to read users file');
    }
};

const writeUsers = async (users) => {
    try {
        await fs.writeFile(filePath, JSON.stringify({ users }, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing users file:', error);
        throw new Error('Failed to write users file');
    }
};

const addUser = async (user) => {
    const data = await readUsers();
    const newUser = {
        id: generateUniqueId(data.users),
        name: user.name,
        email: user.email
    };
    data.users.push(newUser);
    await writeUsers(data.users);
    return newUser;
};

const updateUser = async (id, update) => {
    const data = await readUsers();
    const index = data.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    data.users[index] = { ...data.users[index], ...update };
    await writeUsers(data.users);
    return true;
};

const deleteUser = async (id) => {
    const data = await readUsers();
    const exists = data.users.some(u => u.id === id);
    if (!exists) throw new Error('User not found');
    const filteredUsers = data.users.filter(u => u.id !== id);
    await writeUsers(filteredUsers);
    return true;
};

const getUserById = async (id) => {
    const data = await readUsers();
    const user = data.users.find(u => u.id === parseInt(id));
    if (!user) throw new Error('User not found');
    return user;
};

module.exports = {
    readUsers,
    addUser,
    updateUser,
    deleteUser,
    getUserById
};
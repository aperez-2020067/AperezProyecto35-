// user.controller.js
import User from './user.model.js'

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        return res.send({ message: 'Users fetched successfully', users })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error fetching users', err })
    }
}

// Obtener usuario por ID
export const getUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        if (!user) return res.status(404).send({ message: 'User not found' })
        return res.send({ message: 'User found', user })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error fetching user', err })
    }
}

// Actualizar usuario
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { name, username, email } = req.body
        const user = await User.findByIdAndUpdate(id, { name, username, email }, { new: true })
        return res.send({ message: 'User updated successfully', user })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating user', err })
    }
}

// Eliminar usuario
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        await User.findByIdAndDelete(id)
        return res.send({ message: 'User deleted successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting user', err })
    }
}

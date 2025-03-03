// user.controller.js
import User from './user.model.js'
import { checkPassword, encrypt } from "../../utils/encrypt.js";

// Obtener todos los usuarios con paginación
export const getAllUsers = async (req, res) => {
    try {
        // Obtener limit y skip desde los parámetros de consulta
        const { limit = 20, skip = 0 } = req.query;

        // Ejecutar la consulta con paginación
        const users = await User.find()
            .skip(Number(skip)) // Convertir skip a número
            .limit(Number(limit)); // Convertir limit a número

        // Obtener el total de usuarios para enviar la información de la paginación
        const total = await User.countDocuments(); // Cuenta total de usuarios en la base de datos

        if (users.length === 0) return res.status(404).send({ message: 'No users found', success: false });

        // Enviar respuesta con los usuarios y la información de paginación
        return res.send({
            success: true,
            message: 'Users fetched successfully',
            users,
            total, // Total de usuarios
            totalPages: Math.ceil(total / limit), // Calcular el número total de páginas
            currentPage: Math.floor(skip / limit) + 1 // Página actual (basada en skip y limit)
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: 'Error fetching users',
            err
        });
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

// Actualizar Usuario
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params; // ID del usuario a actualizar
        const { user } = req; // Usuario del token (JWT)

        // Verificar que el usuario existe
        const userToUpdate = await User.findById(id);
        if (!userToUpdate) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Si el usuario no es ADMIN y no es el mismo que intenta actualizar
        if (user.role !== 'ADMIN' && user.uid !== id) {
            return res.status(403).send({ message: 'Forbidden, you are not allowed to update this user' });
        }

       
        userToUpdate.name = req.body.name || userToUpdate.name;
        userToUpdate.surname = req.body.surname || userToUpdate.surname;
        userToUpdate.username = req.body.username || userToUpdate.username;
        userToUpdate.email = req.body.email || userToUpdate.email;
        

        await userToUpdate.save();

        return res.send({ message: 'User updated successfully', user: userToUpdate });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating user', err });
    }
};


// Eliminar Usuario
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params; // ID del usuario a eliminar
        const { user } = req; // Usuario del token (JWT)

        // Verificar que el usuario existe
        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Si el usuario no es ADMIN y no es el mismo que intenta eliminar
        if (user.role !== 'ADMIN' && user.uid !== id) {
            return res.status(403).send({ message: 'Forbidden, you are not allowed to delete this user' });
        }

        // Eliminar el usuario
        await User.findByIdAndDelete(id);

        return res.send({ message: 'User deleted successfully' });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting user', err });
    }
};



  // Crear un administrador por defecto al iniciar el proyecto
export const createDefaultAdmin = async () => {
    try {
        // Verificar si ya existe un usuario con rol ADMIN
        const adminUser = await User.findOne({ role: 'ADMIN' });
        if (adminUser) {
            console.warn('Admin already exists');
            return;
        }

        // Crear un nuevo admin con contraseña segura
        const hashedPassword = await encrypt('adminPasswor!1s'); // Modificar antes de producción

        const newAdmin = new User({
            name: 'Admin',
            surname: 'System',
            username: 'admin',
            email: 'admin@system.com',
            password: hashedPassword,
            phone: '48333561',
            role: 'ADMIN',
            status: true,
        });

        await newAdmin.save();
        console.log('Default admin created');
    } catch (err) {
        console.error('Error creating default admin:', err);
    }
};

// user.routes.js
import { Router } from 'express'
import { getAllUsers, getUser, updateUser, deleteUser } from './user.controller.js'
import { isClient, validateJwt,isAdminOrSameUser } from '../../middlewares/validate.jwt.js'
import { isAdmin } from '../../middlewares/validate.jwt.js'
import { uploadProfilePicture } from '../../middlewares/multer.uploads.js'
import {updateValidator} from '../../helpers/validators.js'
import { deleteFileOnErrorUpdate  } from '../../middlewares/delete.file.on.error.js'
const api = Router()

// Rutas privadas
api.get('/userlist', [validateJwt, isAdmin], getAllUsers)  // Solo accesibles por ADMIN
api.get('/user/:id', [validateJwt], getUser)  // Todos pueden ver su propio perfil
api.put('/update/:id', [validateJwt,isAdminOrSameUser,uploadProfilePicture.single('profilePicture'),
    updateValidator,
    deleteFileOnErrorUpdate], updateUser)  // Solo el usuario o ADMIN pueden modificar
api.delete('/delete/:id', [validateJwt,isAdminOrSameUser], deleteUser)

export default api

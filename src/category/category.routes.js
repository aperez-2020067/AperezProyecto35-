// category.routes.js
import { Router } from 'express'
import { createCategory, getCategories, updateCategory, deleteCategory } from './category.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { isAdmin } from '../../middlewares/validate.jwt.js'

const api = Router()

// Rutas privadas
api.post('/create', [validateJwt, isAdmin], createCategory)
api.get('/list', getCategories)
api.put('/update/:id', [validateJwt, isAdmin], updateCategory)
api.delete('/delete/:id', [validateJwt, isAdmin], deleteCategory)

export default api

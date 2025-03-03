// category.routes.js
import { Router } from 'express'
import { createCategory, getCategories, updateCategory, deleteCategory } from './category.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { isAdmin } from '../../middlewares/validate.jwt.js'
import { createCategoryValidator, updateCategoryValidator} from '../../helpers/validators.js'

const api = Router()

// Rutas privadas
api.post('/create', [validateJwt, isAdmin,createCategoryValidator], createCategory)
api.get('/list',[validateJwt], getCategories)
api.put('/update/:id', [validateJwt, isAdmin,updateCategoryValidator], updateCategory)
api.delete('/delete/:id', [validateJwt, isAdmin], deleteCategory)

export default api

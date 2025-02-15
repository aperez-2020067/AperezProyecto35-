// product.routes.js
import { Router } from 'express'
import { createProduct, getProducts, updateProduct, deleteProduct } from './product.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { isAdmin } from '../../middlewares/validate.jwt.js'

const api = Router()

// Rutas privadas (solo accesibles para administradores)
api.post('/prodcutcreate', [validateJwt, isAdmin], createProduct)
api.get('/productlist', [validateJwt], getProducts)  // Accesible para todos los usuarios
api.put('/productupdate/:id', [validateJwt, isAdmin], updateProduct)
api.delete('/productdelete/:id', [validateJwt, isAdmin], deleteProduct)

export default api

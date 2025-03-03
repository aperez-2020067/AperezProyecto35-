import { Router } from 'express'
import { 
    createProduct, 
    getProducts, 
    updateProduct, 
    deleteProduct, 
    searchProducts, 
    getOutOfStockProducts, 
    getBestSellingProducts, 
    getProductsByCategory, 
    updateStock 
} from './product.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { isAdmin } from '../../middlewares/validate.jwt.js'
import { createProductValidator, updateProductValidator} from '../../helpers/validators.js'

const api = Router()

// Crear producto (solo administrador)
api.post('/productcreate', [validateJwt, isAdmin, createProductValidator], createProduct)

// Obtener todos los productos (accesible para todos los usuarios)
api.get('/productlist', [validateJwt], getProducts)  

// Buscar productos por nombre (accesible para todos los usuarios)
api.get('/products/search', [validateJwt], searchProducts)

// Obtener productos agotados (solo administrador)
api.get('/admin/products/out-of-stock', [validateJwt, isAdmin], getOutOfStockProducts)

// Obtener los productos más vendidos (para todos)
api.get('/admin/products/best-sellers', [validateJwt], getBestSellingProducts)

// Filtrar productos por categoría (accesible para todos los usuarios)
api.get('/products/category/:categoryId', [validateJwt], getProductsByCategory)

// Actualizar stock de un producto (solo administrador)
api.put('/admin/products/update-stock/:id', [validateJwt, isAdmin], updateStock)

// Editar producto (solo administrador)
api.put('/productupdate/:id', [validateJwt, isAdmin,updateProductValidator], updateProduct)

// Eliminar producto (solo administrador)
api.delete('/productdelete/:id', [validateJwt, isAdmin], deleteProduct)

export default api

import { Router } from 'express';
import { addToCart, getCart, removeFromCart, removeCart } from './cart.controller.js';
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { addToCartValidator} from '../../helpers/validators.js'
const api = Router();

// Agregar un producto al carrito
api.post('/carrito',[validateJwt,addToCartValidator], addToCart);

// Ver el carrito de compras
api.get('/vercarrito', [validateJwt], getCart);

// Eliminar un producto del carrito
api.delete('/carritodelete/:productId', [validateJwt], removeFromCart);


// Eliminar todo el carrito
api.delete('/deletecarrito/:carritoId', [validateJwt], removeCart); 

export default api;

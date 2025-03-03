import { Router } from 'express';
import { createOrder, getUserOrders, updateOrder, deleteOrder } from './order.controller.js';
import { validateJwt } from '../../middlewares/validate.jwt.js'
import { createOrderValidator,updateOrderValidator} from '../../helpers/validators.js'

const api = Router();

// Crear un nuevo pedido
api.post('/createpedido', [validateJwt,createOrderValidator], createOrder);

// Obtener todos los pedidos de un usuario
api.get('/pedido/:userId', [validateJwt], getUserOrders);

// Actualizar un pedido
api.put('/ordersupdate/:orderId',[validateJwt,updateOrderValidator], updateOrder);

// Eliminar un pedido
api.delete('/ordersdelete/:orderId',[validateJwt], deleteOrder);
export default api;

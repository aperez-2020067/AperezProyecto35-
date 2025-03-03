import { Router } from 'express';
import { createInvoice, getUserInvoices, deleteInvoice, updateInvoice } from './invoice.controller.js';
import { validateJwt,isAdmin } from '../../middlewares/validate.jwt.js'
import { updateInvoiceValidator,createInvoiceValidator} from '../../helpers/validators.js'
const api = Router();

// Crear una nueva factura
api.post('/createfacture', [validateJwt,isAdmin,createInvoiceValidator], createInvoice);

// Obtener todas las facturas de un usuario
api.get('/facture/:userId', [validateJwt,isAdmin], getUserInvoices);

// Actualizar factura
api.put('/updatefacture/:invoiceId', [validateJwt,updateInvoiceValidator,isAdmin], updateInvoice);

// Eliminar una factura
api.delete('/deletefacture/:invoiceId', [validateJwt,isAdmin ], deleteInvoice);


export default api;

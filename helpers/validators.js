//Validar campos en las rutas
import { body } from "express-validator" //Capturar todo el body de la solicitud
import { validateErrors, validateErrorWithoutImg} from "./validate.error.js"
import { existUsername, objectIdValid, existCategoryName, categoryIdValid ,checkCategoryExistence  } from "./db.validators.js"
import { existProductName,productIdValid } from "./db.validators.js"
import { productExists, cartExists, invoiceExists } from './db.validators.js';
import { orderIdValid, userIdValid, invoiceIdValid } from './db.validators.js';

export const registerValidator = [
    body('name', 'Name cannot be empty')
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .notEmpty(),
    body('email', 'Email cannot be empty or is not a valid email')
        .notEmpty()
        .isEmail(),
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({min: 8}),
    body('phone', 'Phone cannot be empty or is not a valid phone')
        .notEmpty()
        .isMobilePhone(),
    validateErrors
]

export const loginValidator = [
    body('username', 'Username cannot be empty')
        .notEmpty()
        .toLowerCase(),
    body('password', 'Password cannot be empty')
        .notEmpty()
        .isStrongPassword()
        .withMessage('The password must be strong')
        .isLength({min: 8}),
    validateErrorWithoutImg
]


export const updateValidator = [
    body('name', 'Name cannot be empty')
        .optional()
        .notEmpty(),
    body('surname', 'Surname cannot be empty')
        .optional()
        .notEmpty(),
    body('email', 'Email cannot be empty or is not a valid email')
        .optional()
        .notEmpty()
        .isEmail(),
    body('username', 'Username cannot be empty')
        .optional()
        .notEmpty()
        .toLowerCase()
        .custom(existUsername),
    body('phone', 'Phone cannot be empty or is not a valid phone')
        .optional()
        .notEmpty()
        .isMobilePhone(),
    validateErrors
]

// Crear categoría
export const createCategoryValidator = [
    body('name', 'Category name cannot be empty')
        .notEmpty()
        .custom(existCategoryName), // Verifica que el nombre de la categoría no esté duplicado
    body('description', 'Description cannot be empty')
        .notEmpty(),
    validateErrorWithoutImg,  // Valida errores y responde
];

// Actualizar categoría
export const updateCategoryValidator = [
    body('name', 'Category name cannot be empty')
        .optional()
        .notEmpty()
        .custom(existCategoryName), // Verifica que el nombre de la categoría no esté duplicado
    body('description', 'Description cannot be empty')
        .optional()
        .notEmpty(),
    validateErrorWithoutImg,  // Valida errores y responde
];

// Crear producto
export const createProductValidator = [
    body('name', 'Product name cannot be empty')
        .notEmpty()
        .custom(existProductName), // Verifica que el nombre del producto no esté duplicado
    body('description', 'Description cannot be empty')
        .notEmpty(),
    body('price', 'Price should be a valid number')
        .isFloat({ gt: 0 }),  // Verifica que el precio sea un número mayor que 0
    body('stock', 'Stock should be a valid number')
        .isInt({ min: 0 }),  // Verifica que el stock sea un número entero mayor o igual a 0
    body('category', 'Invalid category')
        .notEmpty()
        .custom(categoryIdValid), // Verifica que la categoría del producto sea válida
    validateErrorWithoutImg,  // Valida errores y responde
];

// Actualizar producto
export const updateProductValidator = [
    body('name', 'Product name cannot be empty')
        .optional()
        .notEmpty()
        .custom(existProductName), // Verifica que el nombre del producto no esté duplicado
    body('description', 'Description cannot be empty')
        .optional()
        .notEmpty(),
    body('price', 'Price should be a valid number')
        .optional()
        .isFloat({ gt: 0 }),  // Verifica que el precio sea un número mayor que 0
    body('stock', 'Stock should be a valid number')
        .optional()
        .isInt({ min: 0 }),  // Verifica que el stock sea un número entero mayor o igual a 0
    body('category', 'Invalid category')
        .optional()
        .notEmpty()
        .custom(categoryIdValid), // Verifica que la categoría del producto sea válida
    validateErrorWithoutImg,  // Valida errores y responde
];

// Agregar producto al carrito
export const addToCartValidator = [
    body('productId', 'Product ID is required').notEmpty().custom(objectIdValid).custom(productExists),
    body('quantity', 'Quantity must be a number greater than or equal to 1').isInt({ min: 1 }),
    validateErrorWithoutImg,  // Valida errores y responde
];


// Crear factura
export const createInvoiceValidator = [
    body('cartId', 'Cart ID is required').notEmpty().custom(objectIdValid).custom(cartExists),
    body('status', 'Status is invalid').optional().isIn(['Pending', 'Paid', 'Canceled']),
    validateErrorWithoutImg,  // Valida errores y responde
];


// Actualizar factura
export const updateInvoiceValidator = [
    body('status', 'Status is invalid').optional().isIn(['Pending', 'Paid', 'Canceled']),
    body('cartId', 'Cart ID is invalid').optional().custom(objectIdValid).custom(cartExists),
    validateErrorWithoutImg,  // Valida errores y responde
];

// Crear Pedido
export const createOrderValidator = [
    body('invoiceId', 'Invoice ID is required')
        .notEmpty()
        .custom(invoiceIdValid),  // Verifica que el invoiceId sea válido y exista
    body('shippingAddress', 'Shipping address cannot be empty')
        .notEmpty(),  // Dirección de envío no puede estar vacía
    body('paymentMethod', 'Payment method is required')
        .notEmpty(),  // El método de pago no puede estar vacío
    body('status', 'Status must be one of: Processing, Shipped, Delivered, or Cancelled')
        .optional()
        .isIn(['Processing', 'Shipped', 'Delivered', 'Cancelled']),  // Validar el estado de la orden
    validateErrorWithoutImg,  // Validación de errores
];

// Actualizar Pedido
export const updateOrderValidator = [
    body('status', 'Status must be one of: Processing, Shipped, Delivered, or Cancelled')
        .optional()
        .isIn(['Processing', 'Shipped', 'Delivered', 'Cancelled']),  // Validar el estado de la orden
    body('shippingAddress', 'Shipping address cannot be empty')
        .optional()
        .notEmpty(),  // Dirección de envío no puede estar vacía
    validateErrorWithoutImg,  // Validación de errores
];

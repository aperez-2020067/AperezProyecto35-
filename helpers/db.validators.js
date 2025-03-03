//Validaciones en relación a la BD
import User from '../src/user/user.model.js';
import { isValidObjectId } from 'mongoose';
import Category from '../src/category/category.model.js';
import Product from '../src/producto/product.model.js';
import Cart from '../src/cart/cart.model.js';
import Invoice from '../src/invoice/invoice.model.js';
import Order from '../src/order/order.model.js';

// Verifica si el nombre de usuario ya está registrado
export const existUsername = async (username) => {
    const alreadyUsername = await User.findOne({ username });
    if (alreadyUsername) {
        console.error(`Username ${username} is already taken`);
        throw new Error(`Username ${username} is already taken`);
    }
};

// Verifica si el email ya está registrado
export const existEmail = async (email) => {
    const alreadyEmail = await User.findOne({ email });
    if (alreadyEmail) {
        console.error(`Email ${email} is already taken`);
        throw new Error(`Email ${email} is already taken`);
    }
};

// Verifica si el ObjectId es válido
export const objectIdValid = async (objectId) => {
    if (!isValidObjectId(objectId)) {
        throw new Error('Invalid ObjectId');
    }
};

// Verifica si el nombre de la categoría ya está registrado
export const existCategoryName = async (name) => {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
        console.error(`Category name ${name} is already taken`);
        throw new Error(`Category name ${name} is already taken`);
    }
};

// Verifica si el ObjectId de la categoría es válido
export const categoryIdValid = async (categoryId) => {
    if (!isValidObjectId(categoryId)) {
        throw new Error('Invalid Category ObjectId');
    }
};

// Verifica si la categoría existe
export const checkCategoryExistence = async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category) {
        throw new Error('Category not found');
    }
};

// Verificar si el nombre del producto ya está registrado
export const existProductName = async (name) => {
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
        console.error(`Product name ${name} is already taken`);
        throw new Error(`Product name ${name} is already taken`);
    }
};

// Verificar si el ObjectId del producto es válido
export const productIdValid = async (productId) => {
    if (!isValidObjectId(productId)) {
        throw new Error('Invalid Product ObjectId');
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new Error('Product does not exist');
    }
};

// Verifica si el producto existe en la base de datos
export const productExists = async (productId) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
    }
};

export const cartExists = async (cartId) => {
    const cart = await Cart.findById(cartId);  // Verifica si el carrito existe por su ID
    if (!cart) {
        throw new Error('Cart not found');
    }
};

// Verifica si la factura existe
export const invoiceExists = async (invoiceId) => {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
        throw new Error('Invoice not found');
    }
};

// Verifica si el orderId es válido y existe en la base de datos
export const orderIdValid = async (orderId) => {
    if (!isValidObjectId(orderId)) {
        throw new Error('Invalid Order ID');
    }
    const order = await Order.findById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }
};

// Verifica si el userId es válido
export const userIdValid = async (userId) => {
    if (!isValidObjectId(userId)) {
        throw new Error('Invalid User ID');
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
};

// Verifica si el invoiceId es válido y existe en la base de datos
export const invoiceIdValid = async (invoiceId) => {
    if (!isValidObjectId(invoiceId)) {
        throw new Error('Invalid Invoice ID');
    }
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
        throw new Error('Invoice not found');
    }
};
import Invoice from './invoice.model.js';
import Cart from '../cart/cart.model.js';
import Product from '../producto/product.model.js';

export const createInvoice = async (req, res) => {
  try {
    const { cartId, status } = req.body;

    // Verificar que cartId esté presente
    if (!cartId) {
      return res.status(400).send({ message: 'cartId es obligatorio' });
    }

    // Buscar el carrito asociado con el cartId
    const cart = await Cart.findById(cartId).populate('items.productId');
    if (!cart) {
      return res.status(404).send({ message: 'Carrito no encontrado' });
    }

    // Obtener el userId del carrito
    const userId = cart.userId;

    // Calcular el totalAmount sumando los precios de los productos en el carrito
    let totalAmount = 0;
    const products = cart.items.map(item => {
      totalAmount += item.productId.price * item.quantity; // Calcular el total por producto
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: item.productId.price,
      };
    });

    // Crear la factura con los datos obtenidos
    const invoice = new Invoice({
      userId, // Usuario asociado con el carrito
      cartId, // Carrito asociado
      status: status || 'Pending', // Si no se pasa un status, por defecto será 'Pending'
      products, // Los productos del carrito
      totalAmount, // Monto total de la factura
    });

    // Guardar la factura
    await invoice.save();

    return res.status(201).send({ message: 'Factura creada', invoice });
  } catch (error) {
    console.error('Error al crear factura:', error);
    return res.status(500).send({ message: 'Error al crear la factura', error: error.message });
  }
};



export const getUserInvoices = async (req, res) => {
    try {
      const { userId } = req.params;  // El id del usuario cuyas facturas deseas obtener
  
      // Buscar todas las facturas asociadas al userId
      const invoices = await Invoice.find({ userId })
        .populate('cartId')  // Opcional: Si necesitas detalles sobre el carrito
        .populate('products.productId');  // Opcional: Si necesitas detalles de los productos
  
      if (!invoices || invoices.length === 0) {
        return res.status(404).send({ message: 'No se encontraron facturas para este usuario' });
      }
  
      return res.status(200).send({ message: 'Facturas obtenidas', invoices });
    } catch (error) {
      console.error('Error al obtener las facturas por usuario:', error);
      return res.status(500).send({ message: 'Error al obtener las facturas', error: error.message });
    }
  };

// Actualizar una factura existente
export const updateInvoice = async (req, res) => {
    try {
      const { invoiceId } = req.params;  // El id de la factura a editar
      const { status, cartId } = req.body;  // Nuevos valores para la factura
  
      // Buscar la factura en la base de datos
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        return res.status(404).send({ message: 'Factura no encontrada' });
      }
  
      // Si se quiere actualizar el estado de la factura
      if (status) {
        invoice.status = status;
      }
  
      // Si se quiere actualizar el cartId
      if (cartId) {
        // Verificar si el cartId es válido y si existe
        const cart = await Cart.findById(cartId);
        if (!cart) {
          return res.status(404).send({ message: 'Carrito no encontrado' });
        }
        invoice.cartId = cartId;
      }
  
      // Guardar la factura actualizada
      await invoice.save();
  
      return res.status(200).send({ message: 'Factura actualizada', invoice });
    } catch (error) {
      console.error('Error al actualizar la factura:', error);
      return res.status(500).send({ message: 'Error al actualizar la factura', error: error.message });
    }
  };


//Eliminar Invoice
export const deleteInvoice = async (req, res) => {
    try {
      const { invoiceId } = req.params;
  
      // Buscar la factura y eliminarla
      const invoice = await Invoice.findByIdAndDelete(invoiceId);
      if (!invoice) {
        return res.status(404).send({ message: 'Factura no encontrada' });
      }
  
      return res.status(200).send({ message: 'Factura eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar la factura:', error);
      return res.status(500).send({ message: 'Error al eliminar la factura', error: error.message });
    }
  };
  

import Order from './order.model.js';
import Invoice from '../invoice/invoice.model.js';
import Product from '../producto/product.model.js';  // Asegúrate de tener el modelo de Producto

// Crear un nuevo pedido
export const createOrder = async (req, res) => {
    try {
      const { invoiceId, shippingAddress, paymentMethod, status } = req.body;
      const userId = req.user.uid; // Usamos uid en lugar de id
  
      // Verificar si la factura existe y pertenece al usuario
      const invoice = await Invoice.findById(invoiceId).populate('products.productId');
      if (!invoice || invoice.userId.toString() !== userId) {
        return res.status(404).send({ message: 'Factura no encontrada o no autorizada' });
      }
  
      // Verificar el stock de los productos y reducirlo
      for (let item of invoice.products) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).send({ message: `Producto con ID ${item.productId} no encontrado` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).send({ message: `No hay suficiente stock para el producto ${product.name}` });
        }
  
        // Reducir el stock del producto
        product.stock -= item.quantity;
        await product.save();
      }
  
      // Si no se proporciona un status, lo establecemos por defecto como 'Processing'
      const orderStatus = status || 'Processing';
  
      // Crear el pedido
      const order = new Order({
        invoiceId,
        userId,
        status: orderStatus,  // El estado del pedido
        shippingAddress,
        paymentMethod,
      });
  
      // Guardar el pedido
      await order.save();
  
      return res.status(201).send({ message: 'Pedido creado', order, invoice });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Error al crear el pedido' });
    }
  };
  

// Obtener todos los pedidos de un usuario
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.uid }); // Usamos uid en lugar de id
    return res.status(200).send({ orders });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Error al obtener los pedidos' });
  }
};

// Actualizar un pedido
export const updateOrder = async (req, res) => {
    try {
      const { orderId } = req.params;  // El id del pedido a actualizar
      const { status, shippingAddress } = req.body;  // Nueos valores para el pedido
  
      // Buscar el pedido en la base de datos
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).send({ message: 'Pedido no encontrado' });
      }
  
      // Verificar que el usuario sea el propietario del pedido
      if (order.userId.toString() !== req.user.uid) {  // Usamos uid en lugar de id
        return res.status(403).send({ message: 'No tienes permiso para actualizar este pedido' });
      }
  
      // Si se quiere actualizar el estado del pedido
      if (status) {
        order.status = status;
      }
  
      // Si se quiere actualizar la dirección de envío
      if (shippingAddress) {
        order.shippingAddress = shippingAddress;
      }
  
      // Guardar el pedido actualizado
      await order.save();
  
      return res.status(200).send({ message: 'Pedido actualizado', order });
    } catch (error) {
      console.error('Error al actualizar el pedido:', error);
      return res.status(500).send({ message: 'Error al actualizar el pedido', error: error.message });
    }
  };
  

// Eliminar un pedido
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;  // El id del pedido a eliminar

    // Buscar el pedido en la base de datos
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send({ message: 'Pedido no encontrado' });
    }

    // Verificar que el usuario sea el propietario del pedido
    if (order.userId.toString() !== req.user.uid) {  // Usamos uid en lugar de id
      return res.status(403).send({ message: 'No tienes permiso para eliminar este pedido' });
    }

    // Obtener la factura asociada al pedido
    const invoice = await Invoice.findById(order.invoiceId).populate('products.productId');
    if (!invoice) {
      return res.status(404).send({ message: 'Factura no encontrada' });
    }

    // Recuperar el stock de los productos de la factura
    for (let item of invoice.products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).send({ message: `Producto con ID ${item.productId} no encontrado` });
      }

      // Restablecer el stock del producto
      product.stock += item.quantity;
      await product.save();
    }

    // Eliminar el pedido utilizando deleteOne()
    await order.deleteOne();  // Cambio aquí de .remove() a .deleteOne()

    return res.status(200).send({ message: 'Pedido eliminado exitosamente y stock restablecido' });
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
    return res.status(500).send({ message: 'Error al eliminar el pedido', error: error.message });
  }
};

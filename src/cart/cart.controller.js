import Cart from './cart.model.js';
import Product from '../producto/product.model.js';

//Crear carrito
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Usamos `req.user.uid` ya que `uid` es el que se asigna en el token, no `id`
    const userId = req.user.uid; // Cambié de `req.user.id` a `req.user.uid`

    console.log('userId:', userId); // Asegúrate de que esto esté imprimiendo un valor válido

    // Verificar si el producto existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ message: 'Producto no encontrado' });
    }

    console.log('Producto encontrado:', product);

    // Verificar si el producto tiene stock suficiente
    if (product.stock <= 0) {
      return res.status(400).send({ message: 'El producto no está disponible en stock' });
    }

    // Verificar si la cantidad solicitada no excede el stock disponible
    if (product.stock < quantity) {
      return res.status(400).send({ message: `Solo hay ${product.stock} unidades disponibles` });
    }

    // Buscar si el usuario ya tiene un carrito
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // Si no existe un carrito, creamos uno
      cart = new Cart({
        userId, // Aquí usamos el `userId` correcto
        items: [{ productId, quantity }],
      });
      console.log('Nuevo carrito creado');
    } else {
      // Si ya existe un carrito, lo actualizamos
      const productIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId.toString()
      );
      if (productIndex >= 0) {
        // Si el producto ya está en el carrito, actualizamos la cantidad
        cart.items[productIndex].quantity += quantity;
        console.log('Producto actualizado en el carrito');
      } else {
        // Si el producto no está en el carrito, lo agregamos
        cart.items.push({ productId, quantity });
        console.log('Producto agregado al carrito');
      }
    }

    // Guardamos el carrito
    await cart.save();
    console.log('Carrito guardado');

    return res.status(200).send({ message: 'Producto agregado al carrito', cart });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Error al agregar al carrito' });
  }
};

  
// Obtener el carrito de un usuario
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.uid }).populate('items.productId');
    if (!cart) {
      return res.status(404).send({ message: 'Carrito no encontrado' });
    }
    return res.status(200).send({ cart });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Error al obtener el carrito' });
  }
};

// Eliminar un producto del carrito
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.uid });
    if (!cart) {
      return res.status(404).send({ message: 'Carrito no encontrado' });
    }

    // Filtrar el producto del carrito
    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();

    return res.status(200).send({ message: 'Producto eliminado del carrito', cart });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Error al eliminar el producto' });
  }
};

// Eliminar todo el carrito de un usuario
export const removeCart = async (req, res) => {
    try {
      const userId = req.user.uid; // Usamos el uid del usuario del token
  
      // Buscar el carrito del usuario
      const cart = await Cart.findOne({ userId });
      
      // Si el carrito no existe
      if (!cart) {
        return res.status(404).send({ message: 'Carrito no encontrado' });
      }
  
      // Verificar que el carrito pertenece al usuario autenticado
      if (cart.userId.toString() !== userId) {
        return res.status(403).send({ message: 'No tienes permiso para eliminar este carrito' });
      }
  
      // Eliminar el carrito
      await Cart.deleteOne({ userId });
  
      return res.status(200).send({ message: 'Carrito eliminado con éxito' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Error al eliminar el carrito' });
    }
  };
  
  
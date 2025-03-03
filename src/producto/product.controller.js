import Product from './product.model.js'
import Category from '../category/category.model.js'
import Order from '../order/order.model.js';

// Crear producto
export const createProduct = async (req, res) => {
    try {
        // Obtener los datos del producto desde el cuerpo de la solicitud
        const { name, description, price, stock, category } = req.body

        // Crear un nuevo producto
        const product = new Product({ name, description, price, stock, category })

        // Guardar el producto en la base de datos
        await product.save()

        // Responder con éxito
        return res.send({ message: 'Product created successfully', product })
    } catch (err) {
        // Manejo de errores
        console.error(err)
        return res.status(500).send({ message: 'Error creating product', err })
    }
}

// Ver productos (por nombre, más vendidos, etc.)
// Obtener productos con paginación
export const getProducts = async (req, res) => {
    try {
        // Obtener limit y skip desde los parámetros de consulta
        const { limit = 20, skip = 0 } = req.query;

        // Ejecutar la consulta con paginación y poblando la categoría
        const products = await Product.find()
            .skip(Number(skip)) // Convertir skip a número
            .limit(Number(limit)) // Convertir limit a número
            .populate('category'); // Poblamos la categoría de cada producto

        // Obtener el total de productos para enviar la información de la paginación
        const total = await Product.countDocuments(); // Cuenta total de productos en la base de datos

        if (products.length === 0) return res.status(404).send({ message: 'No products found', success: false });

        // Enviar respuesta con los productos y la información de la paginación
        return res.send({
            success: true,
            message: 'Products fetched successfully',
            products,
            total, // Total de productos
            totalPages: Math.ceil(total / limit), // Calcular el número total de páginas
            currentPage: Math.floor(skip / limit) + 1 // Página actual (basada en skip y limit)
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: 'Error fetching products',
            err
        });
    }
}


// Buscar productos por nombre
export const searchProducts = async (req, res) => {
    try {
        // Obtener el query (término de búsqueda) de los parámetros de la solicitud
        const { query } = req.query

        // Buscar productos que coincidan con el nombre (no sensible a mayúsculas/minúsculas)
        const products = await Product.find({
            name: { $regex: query, $options: 'i' } // $regex permite búsqueda por texto
        }).populate('category')

        // Responder con los productos encontrados
        return res.send({ message: 'Products fetched successfully', products })
    } catch (err) {
        // Manejo de errores
        console.error(err)
        return res.status(500).send({ message: 'Error searching products', err })
    }
}

// Obtener productos agotados (stock = 0)
export const getOutOfStockProducts = async (req, res) => {
    try {
        // Buscar productos con stock 0
        const products = await Product.find({ stock: 0 }).populate('category')

        // Responder con los productos agotados
        return res.send({ message: 'Out of stock products fetched successfully', products })
    } catch (err) {
        // Manejo de errores
        console.error(err)
        return res.status(500).send({ message: 'Error fetching out of stock products', err })
    }
}

// Obtener los productos más vendidos 
export const getBestSellingProducts = async (req, res) => {
    try {
      // Obtener las órdenes que han sido "Procesadas", "Enviado" o "Entregado" (puedes ajustar estos filtros si es necesario)
      const orders = await Order.find({ status: { $in: ['Shipped', 'Delivered'] } }).populate('invoiceId');
  
      // Crear un objeto para contar la cantidad de veces que cada producto ha sido comprado
      const productSales = {};
  
      // Recorrer las órdenes y contar las ventas de cada producto
      orders.forEach(order => {
        // Recorrer los productos de la factura asociada a la orden
        order.invoiceId.products.forEach(item => {
          // Si el producto ya está en el objeto, sumamos la cantidad
          if (productSales[item.productId.toString()]) {
            productSales[item.productId.toString()] += item.quantity;
          } else {
            productSales[item.productId.toString()] = item.quantity;
          }
        });
      });
  
      // Convertir el objeto de ventas a un arreglo de productos con sus cantidades
      const salesData = Object.entries(productSales).map(([productId, quantity]) => ({
        productId,
        quantity,
      }));
  
      // Ordenar los productos por la cantidad de ventas de mayor a menor
      salesData.sort((a, b) => b.quantity - a.quantity);
  
      // Obtener los productos más vendidos
      const topProducts = await Promise.all(
        salesData.slice(0, 10).map(async ({ productId }) => {
          const product = await Product.findById(productId).populate('category');
          return product;
        })
      );
  
      // Responder con los productos más vendidos
      return res.send({ message: 'Best selling products fetched successfully', products: topProducts });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error fetching best selling products', err });
    }
  };

// Filtrar productos por categoría
export const getProductsByCategory = async (req, res) => {
    try {
        // Obtener el ID de la categoría desde los parámetros
        const { categoryId } = req.params

        // Buscar productos que pertenezcan a la categoría
        const products = await Product.find({ category: categoryId }).populate('category')

        // Responder con los productos de la categoría
        return res.send({ message: 'Products by category fetched successfully', products })
    } catch (err) {
        // Manejo de errores
        console.error(err)
        return res.status(500).send({ message: 'Error fetching products by category', err })
    }
}

// Editar producto
export const updateProduct = async (req, res) => {
    try {
        // Obtener el ID del producto desde los parámetros y los datos del cuerpo de la solicitud
        const { id } = req.params
        const { name, description, price, stock, category } = req.body

        // Actualizar el producto en la base de datos
        const product = await Product.findByIdAndUpdate(id, { name, description, price, stock, category }, { new: true })

        // Responder con el producto actualizado
        return res.send({ message: 'Product updated successfully', product })
    } catch (err) {
        // Manejo de errores
        console.error(err)
        return res.status(500).send({ message: 'Error updating product', err })
    }
}

// Eliminar producto
export const deleteProduct = async (req, res) => {
    try {
        // Obtener el ID del producto desde los parámetros
        const { id } = req.params

        // Eliminar el producto de la base de datos
        await Product.findByIdAndDelete(id)

        // Responder con un mensaje de éxito
        return res.send({ message: 'Product deleted successfully' })
    } catch (err) {
        // Manejo de errores
        console.error(err)
        return res.status(500).send({ message: 'Error deleting product', err })
    }
}

// Actualizar el stock de un producto (nueva funcionalidad sugerida)
export const updateStock = async (req, res) => {
    try {
        // Obtener el ID del producto desde los parámetros y el nuevo stock desde el cuerpo
        const { id } = req.params
        const { stock } = req.body

        // Actualizar el stock del producto
        const product = await Product.findByIdAndUpdate(id, { stock }, { new: true })

        // Responder con el producto actualizado
        return res.send({ message: 'Product stock updated successfully', product })
    } catch (err) {
        // Manejo de errores
        console.error(err)
        return res.status(500).send({ message: 'Error updating product stock', err })
    }
}

// category.controller.js
import Category from './category.model.js'
import Product from '../producto/product.model.js';

// Crear categoría
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body
        const category = new Category({ name, description })
        await category.save()
        return res.send({ message: 'Category created successfully', category })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error creating category', err })
    }
}

// Obtener todas las categorías con paginación
export const getCategories = async (req, res) => {
    try {
        // Obtener limit y skip desde los parámetros de consulta
        const { limit = 20, skip = 0 } = req.query;

        // Ejecutar la consulta con paginación
        const categories = await Category.find()
            .skip(Number(skip)) // Convertir skip a número
            .limit(Number(limit)); // Convertir limit a número

        // Obtener el total de categorías para enviar la información de la paginación
        const total = await Category.countDocuments(); // Cuenta total de categorías en la base de datos

        if (categories.length === 0) return res.status(404).send({ message: 'No categories found', success: false });

        // Enviar respuesta con las categorías y la información de paginación
        return res.send({
            success: true,
            message: 'Categories fetched successfully',
            categories,
            total, // Total de categorías
            totalPages: Math.ceil(total / limit), // Calcular el número total de páginas
            currentPage: Math.floor(skip / limit) + 1 // Página actual (basada en skip y limit)
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: 'Error fetching categories',
            err
        });
    }
}


// Actualizar categoría
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description } = req.body
        const category = await Category.findByIdAndUpdate(id, { name, description }, { new: true })
        return res.send({ message: 'Category updated successfully', category })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating category', err })
    }
}

export const deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category) return res.status(404).send({ message: 'Categoría no encontrada' });
  
      // Si la categoría que se intenta eliminar es la por defecto, no se puede eliminar
      if (category.name === 'Default') {
        return res.status(400).send({ message: 'No se puede eliminar la categoría por defecto' });
      }
  
      // Mover los productos asociados a la categoría predeterminada
      const defaultCategory = await Category.findOne({ name: 'Default' });
      if (defaultCategory) {
        await Product.updateMany({ category: id }, { category: defaultCategory._id });
      }
  
      await Category.findByIdAndDelete(id);
      return res.send({ message: 'Categoría eliminada y productos reubicados' });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error al eliminar categoría', err });
    }
  };
  


export const createDefaultCategory = async () => {
    try {
      // Verificar si ya existe una categoría con el nombre "Default"
      const defaultCategory = await Category.findOne({ name: 'Default' });
      if (defaultCategory) {
        console.warn('La categoría por defecto ya existe');
        return;
      }
  
      // Crear una nueva categoría por defecto
      const newCategory = new Category({
        name: 'Default',
        description: 'Categoría por defecto para productos',
      });
  
      await newCategory.save();
      console.log('Categoría por defecto creada');
    } catch (err) {
      console.error('Error al crear la categoría por defecto:', err);
    }
  };
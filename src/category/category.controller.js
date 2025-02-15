// category.controller.js
import Category from './category.model.js'

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

// Obtener categorías
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        return res.send({ message: 'Categories fetched successfully', categories })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error fetching categories', err })
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

// Eliminar categoría
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        const category = await Category.findById(id)
        if (!category) return res.status(404).send({ message: 'Category not found' })

        await Category.findByIdAndDelete(id)
        return res.send({ message: 'Category deleted successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting category', err })
    }
}

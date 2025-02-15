// product.controller.js
import Product from './product.model.js'

// Crear producto
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category } = req.body
        const product = new Product({ name, description, price, stock, category })
        await product.save()
        return res.send({ message: 'Product created successfully', product })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error creating product', err })
    }
}

// Ver productos (por nombre, más vendidos, etc.)
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category')
        return res.send({ message: 'Products fetched successfully', products })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error fetching products', err })
    }
}

// Editar producto
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, price, stock, category } = req.body
        const product = await Product.findByIdAndUpdate(id, { name, description, price, stock, category }, { new: true })
        return res.send({ message: 'Product updated successfully', product })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating product', err })
    }
}

// Eliminar producto
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        await Product.findByIdAndDelete(id)
        return res.send({ message: 'Product deleted successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting product', err })
    }
}

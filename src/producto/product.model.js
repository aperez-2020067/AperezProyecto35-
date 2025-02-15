// product.model.js
import { Schema, model } from 'mongoose'

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true })

export default model('Product', productSchema)


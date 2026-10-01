import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  vendorId: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  stock: {
    type: Number,
    required: true,
  },

  rating: {
    type: Number,
    required: true,
  },

  tags: {
    type: [String],
    default: [],
  },

  description: {
    type: String,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    required: true,
  },

  updatedAt: {
    type: Date,
    required: true,
  },
});

productSchema.index({ category: 1, price: 1 });
productSchema.index({ price: 1 });

const Product = mongoose.model("product", productSchema);

export default Product;

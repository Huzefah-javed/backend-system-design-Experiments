import Product from "../models/product.models.js";

export const product = {
  getProduct: async ({ skip, limit }) =>
    await Product.find().limit(limit).skip(skip).explain("executionStats"),
};

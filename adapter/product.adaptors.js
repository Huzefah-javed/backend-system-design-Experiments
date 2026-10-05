import Product from "../models/product.models.js";

export const product = {
  getProduct: async ({ limit, query }) =>
    await Product.find(query).sort({ _id: 1 }).limit(limit),

  getFilterProduct: async ({ filterQuery, sort }) =>
    await Product.find(filterQuery, { category: 1, price: 1, _id: 0 })
      .sort(sort)
      .explain("executionStats"),
};

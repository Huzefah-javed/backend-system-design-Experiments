import { product } from "../../adapter/product.adaptors.js";

export async function getProductService(page = 1) {
  page = Number(page);
  const limit = 10;
  const skip = limit * (page - 1);
  const result = await product.getProduct({ limit, skip });
  return result;
}

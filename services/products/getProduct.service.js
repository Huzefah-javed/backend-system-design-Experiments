import { product } from "../../adapter/product.adaptors.js";

export async function getProductService(lastItemId) {
  const limit = 10;
  const query = lastItemId ? { _id: { $gt: lastItemId } } : {};
  const result = await product.getProduct({ limit, query });
  return result;
}

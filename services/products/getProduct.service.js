import { product } from "../../adapter/product.adaptors.js";
import { client, oneDayInSecs } from "../../configs/redis.config.js";

export async function getProductService(lastItemId) {
  const limit = 10;
  if (!lastItemId) {
    const data = await client.get("product:page:1");
    if (data) return JSON.parse(data);
  }
  const query = lastItemId ? { _id: { $gt: lastItemId } } : {};
  const result = await product.getProduct({ limit, query });
  if (!lastItemId)
    await client.set("product:page:1", JSON.stringify(result), {
      EX: oneDayInSecs,
    });
  return result;
}

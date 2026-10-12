import { product } from "../../adapter/product.adaptors.js";
import { client, hoyKeyTime } from "../../configs/redis.config.js";

export async function getFilterProductService({
  category,
  lastItemId,
  sortBy,
  minPrice,
  maxPrice,
}) {
  let filterQuery = {};
  let sort = {};

  let redisKey = "productFilter:";

  if (category) {
    let correctCategory = category.charAt(0).toUpperCase() + category.slice(1);
    filterQuery.category = correctCategory;
    redisKey += `category=${correctCategory}:`;
  }

  if (maxPrice || minPrice) {
    filterQuery.price = {};
    if (minPrice) {
      filterQuery.price.$gte = Number(minPrice);
      redisKey += `minPrice=${minPrice}:`;
    }
    if (maxPrice) {
      filterQuery.price.$lte = Number(maxPrice);
      redisKey += `maxPrice=${maxPrice}:`;
    }
  }

  if (lastItemId) {
    filterQuery._id = { $gt: lastItemId };
    redisKey += `lastItemId=${lastItemId}:`;
  }

  if (sortBy) {
    sort[sortBy] = -1;
    redisKey += `sortBy=des`;
  } else {
    redisKey += `sortBy=asc`;
  }

  let data = await client.get(redisKey);
  if (data) return JSON.parse(data);

  let isLock = await client.get("productFilter:reqLock");
  if (!isLock) {
    await client.set("productFilter:reqLock", JSON.stringify(false), {
      EX: hoyKeyTime / 2,
    });
    isLock = await client.get("productFilter:reqLock");
  }
  while (JSON.parse(isLock));

  data = await client.get(redisKey);
  if (data) return JSON.parse(data);

  await client.set("productFilter:reqLock", JSON.stringify(true), {
    EX: hoyKeyTime / 2,
  });

  console.log("im that MF");

  const result = await product.getFilterProduct({ filterQuery, sort });
  await client.set(redisKey, JSON.stringify(result), { EX: hoyKeyTime });
  await client.set("productFilter:reqLock", JSON.stringify(false), {
    EX: hoyKeyTime / 2,
  });

  return result;
}

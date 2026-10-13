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

  
  let isLock = await client.set("productFilter:reqLock", "lock", {
    NX: true,
    EX: hoyKeyTime / 2,
  });
  while (isLock === null || isLock === "lock") {
    isLock = await client.get("productFilter:reqLock");
  }

  data = await client.get(redisKey);
  if (data) return JSON.parse(data);

  console.log("Heading toward db");

  const result = await product.getFilterProduct({ filterQuery, sort });
  await client.set(redisKey, JSON.stringify(result), { EX: hoyKeyTime });
  await client.set("productFilter:reqLock", "unLock", {
    EX: hoyKeyTime / 2,
    NX: true,
  });

  return result;
}

import { product } from "../../adapter/product.adaptors.js";
import { client, hoyKeyTime } from "../../configs/redis.config.js";
import { AppError } from "../../utils/custom.error.js";

export async function getFilterProductService({
  category,
  lastItemId,
  sortBy,
  minPrice,
  maxPrice,
  userIp,
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

  let isLock = await client.set(`lock:${redisKey}`, "lock", {
    NX: true,
    EX: hoyKeyTime / 2,
  });

  let trip = true;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const redisTripper = async (trip) => {
    if (trip) {
      let val = await client.get(`lock:${redisKey}`);
      if (val === "unLock") return true;
      return null;
    } else {
      isLock = await client.set(`lock:${redisKey}`, "lock", {
        NX: true,
        EX: hoyKeyTime / 2,
      });
    }
  };

  while (isLock === null) {
    await sleep(50);
    let res = await redisTripper(trip);
    if (res) break;
    trip = !trip;
  }

  data = await client.get(redisKey);
  if (data) return JSON.parse(data);

  console.log("Heading toward db");
  let result;
  try {
    result = await product.getFilterProduct({ filterQuery, sort });
    await client.set(redisKey, JSON.stringify(result), { EX: hoyKeyTime });
    await client.set(`lock:${redisKey}`, "unLock", {
      NX: true,
      EX: hoyKeyTime / 2,
    });
    return result;
  } catch (error) {
    await client.del(`lock:${redisKey}`);
    throw error;
  } finally {
    await client.del(`lock:${redisKey}`);
  }
}

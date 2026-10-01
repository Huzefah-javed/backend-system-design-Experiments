import { product } from "../../adapter/product.adaptors.js";

export async function getFilterProductService({
  category,
  lastItemId,
  sortBy,
  minPrice,
  maxPrice,
}) {
  let filterQuery = {};
  let sort = {};

  category = category
    ? (filterQuery.category =
        category.charAt(0).toUpperCase() + category.slice(1))
    : category;

  lastItemId = lastItemId
    ? (filterQuery._id = { $gt: lastItemId })
    : lastItemId;

  if (maxPrice || minPrice) {
    filterQuery.price = {};
    minPrice = minPrice
      ? (filterQuery.price.$gte = Number(minPrice))
      : minPrice;
    maxPrice = maxPrice
      ? (filterQuery.price.$lte = Number(maxPrice))
      : maxPrice;
  }

  sortBy = sortBy ? (sort[sortBy] = -1) : sortBy;

  console.log(filterQuery);

  const result = await product.getFilterProduct({ filterQuery, sort });
  return result;
}

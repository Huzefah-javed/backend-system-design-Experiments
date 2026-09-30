import { product } from "../../adapter/product.adaptors.js";

export async function getFilterProductService({
  category,
  lastItemId,
  sortBy,
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

  sortBy = sortBy ? (sort[sortBy] = -1) : sortBy;
  
  const result = await product.getFilterProduct({ filterQuery, sort });
  return result;
}

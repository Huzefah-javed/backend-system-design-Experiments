import { getFilterProductService } from "../../services/products/getFilterProductService.service.js";

export async function getFilterProducts(req, res) {
  let {
    category = null,
    lastItemId = null,
    sortBy = null,
    minPrice = null,
    maxPrice = null,
  } = req.query;

  const data = await getFilterProductService({
    category,
    lastItemId,
    sortBy,
    maxPrice,
    minPrice,
  });

  res.status(200).json({
    executionTimeMillis: data.executionStats?.executionTimeMillis,
    nReturned: data.executionStats?.nReturned,
    totalDocsExamined: data.executionStats?.totalDocsExamined,
    totalKeysExamined: data.executionStats?.totalKeysExamined,
    skipAmount: data.queryPlanner?.winningPlan?.inputStage?.skipAmount,
  });

  // res.status(200).json(data);
}

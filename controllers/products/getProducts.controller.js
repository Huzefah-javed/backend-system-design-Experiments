import { getProductService } from "../../services/products/getProduct.service.js";

export async function getProducts(req, res) {
  let { lastItemId = null } = req.query;
  const data = await getProductService(lastItemId);
  // res.status(200).json({
  //   executionTimeMillis: data.executionStats.executionTimeMillis,
  //   nReturned: data.executionStats.nReturned,
  //   totalDocsExamined: data.executionStats.totalDocsExamined,
  //   totalKeysExamined: data.executionStats.totalKeysExamined,
  //   skipAmount: data.queryPlanner.winningPlan.inputStage.skipAmount,
  // });
  res.status(200).json(data);
}

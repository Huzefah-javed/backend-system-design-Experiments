import { getProductService } from "../../services/products/getProduct.service.js";

export async function getProducts(req, res) {
  let { page = 1 } = req.query;
  const data = await getProductService(Number(page));
  res.status(200).json({
    executionTimeMillis: data.executionStats.executionTimeMillis,
    nReturned: data.executionStats.nReturned,
    totalDocsExamined: data.executionStats.totalDocsExamined,
    totalKeysExamined: data.executionStats.totalKeysExamined,
    skipAmount: data.queryPlanner.winningPlan.inputStage.skipAmount,
  });
}

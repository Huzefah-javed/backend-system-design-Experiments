import { Router } from "express";
import { getProducts } from "../controllers/products/getProducts.controller.js";
import { getFilterProducts } from "../controllers/products/getFilterProducts.controller.js";

export const product = Router();

product.get("/", getProducts);
product.get("/filter", getFilterProducts);

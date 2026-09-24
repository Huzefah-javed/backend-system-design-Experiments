import { Router } from "express";
import { getProducts } from "../controllers/products/getProducts.controller.js";

export const product = Router();

product.get("/", getProducts);

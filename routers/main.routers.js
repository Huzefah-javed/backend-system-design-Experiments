import { Router } from "express";
import { product } from "./products.routers.js";

export const mainRouter = Router();

mainRouter.use("/products", product);

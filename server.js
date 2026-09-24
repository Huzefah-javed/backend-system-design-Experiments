import express from "express";
import { dbConnects } from "./configs/db.config.js";
import { config } from "dotenv";
import { error } from "./middlewares/error.middleware.js";
import { mainRouter } from "./routers/main.routers.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

config();

app.use(mainRouter);
app.use(error);

await dbConnects();

app.listen(process.env.PORT, () => {
  console.log("server runs....", process.env.PORT);
});

import cors from "cors";
import "dotenv/config";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import loggerMiddleware from "./middlewares/logger.js";
import petMarketRoute from "./routes/petmarket.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.use(express.json());
app.use(cors());
app.use(loggerMiddleware);
app.use("/pet-market", petMarketRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log("Servidor levantado con éxito --> http://localhost:" + PORT),
);

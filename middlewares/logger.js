import morgan from "morgan";
import * as rfs from "rotating-file-stream";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDirectory = path.join(__dirname, "../log");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = rfs.createStream("pet_market.log", {
  interval: "1d",
  path: logDirectory,
});

const loggerMiddleware = morgan("combined", { stream: accessLogStream });

export default loggerMiddleware;

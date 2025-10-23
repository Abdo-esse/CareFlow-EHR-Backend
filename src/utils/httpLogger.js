import fs from "fs";
import path from "path";
import morgan from "morgan";
import { fileURLToPath } from "url";

// === Résolution du chemin ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const accessLogPath = path.join(logDir, "access.log");
const logStream = fs.createWriteStream(accessLogPath, { flags: "a" });

export const httpLogger = morgan("combined", { stream: logStream });

export const info = (msg) =>
  console.log(`\x1b[32m[INFO]\x1b[0m ${new Date().toISOString()} - ${msg}`);

export const warn = (msg) =>
  console.warn(`\x1b[33m[WARN]\x1b[0m ${new Date().toISOString()} - ${msg}`);

export const error = (msg, err = "") =>
  console.error(`\x1b[31m[ERROR]\x1b[0m ${new Date().toISOString()} - ${msg}`, err);

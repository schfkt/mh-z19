import path from "path";
import { Reader } from "./reader";

// milliseconds
const READ_AND_PRINT_INTERVAL = 10 * 1000;
const CONFIG_PATH = path.resolve(__dirname, "../config/dev.json");

const reader = new Reader({configPath: CONFIG_PATH});
setInterval(() => reader.readAndPrintValue(), READ_AND_PRINT_INTERVAL);

import express from "express";
import logger from "./utils/logger";
import { connectToDatabase, disconnectFromDatabase } from "./utils/database";
import cookieParser from "cookie-parser";
import cors from "cors";
import { CORS_ORIGIN } from "./constants";
import helmet from "helmet";

const port = process.env.PORT || 4000;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

app.use(helmet());

const server = app.listen(port, async () => {
  await connectToDatabase();
  logger.info(`Server listening at http://localhost:${port}`);
});

const signals = ["SIGTERM", "SIGINT"];

function gracefullShutdown(signal: string) {
  process.on(signal, async () => {
    server.close();
    disconnectFromDatabase();
    process.exit(0);
  });
}

for (let i = 0; i < signals.length; i++) {
  gracefullShutdown(signals[i]);
}

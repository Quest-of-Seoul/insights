import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleLocationStatsSummary,
  handleLocationStatsDistrict,
  handleLocationStatsQuest,
  handleLocationStatsTime,
} from "./routes/analytics";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  app.get("/api/analytics/location-stats/summary", handleLocationStatsSummary);
  app.get("/api/analytics/location-stats/district", handleLocationStatsDistrict);
  app.get("/api/analytics/location-stats/quest", handleLocationStatsQuest);
  app.get("/api/analytics/location-stats/time", handleLocationStatsTime);

  return app;
}

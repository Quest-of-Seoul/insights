import { RequestHandler } from "express";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";

async function fetchFromAPI(endpoint: string) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
}

export const handleLocationStatsSummary: RequestHandler = async (_req, res) => {
  try {
    const data = await fetchFromAPI("/analytics/location-stats/summary");
    res.json(data);
  } catch (error) {
    console.error("Error in handleLocationStatsSummary:", error);
    res.status(500).json({ error: "Failed to fetch summary stats" });
  }
};

export const handleLocationStatsDistrict: RequestHandler = async (_req, res) => {
  try {
    const data = await fetchFromAPI("/analytics/location-stats/district");
    res.json(data);
  } catch (error) {
    console.error("Error in handleLocationStatsDistrict:", error);
    res.status(500).json({ error: "Failed to fetch district stats" });
  }
};

export const handleLocationStatsQuest: RequestHandler = async (_req, res) => {
  try {
    const data = await fetchFromAPI("/analytics/location-stats/quest");
    res.json(data);
  } catch (error) {
    console.error("Error in handleLocationStatsQuest:", error);
    res.status(500).json({ error: "Failed to fetch quest stats" });
  }
};

export const handleLocationStatsTime: RequestHandler = async (req, res) => {
  try {
    const unit = (req.query.unit as string) || "day";
    const data = await fetchFromAPI(`/analytics/location-stats/time?unit=${unit}`);
    res.json(data);
  } catch (error) {
    console.error("Error in handleLocationStatsTime:", error);
    res.status(500).json({ error: "Failed to fetch time stats" });
  }
};

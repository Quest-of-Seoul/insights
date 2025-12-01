import { RequestHandler } from "express";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";

function extractTokenFromRequest(req: Parameters<RequestHandler>[0]): string | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return undefined;
}

async function fetchFromAPI(endpoint: string, userToken: string) {
  if (!userToken) {
    throw new Error("Authentication token is required");
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
}

export const handleLocationStatsSummary: RequestHandler = async (req, res) => {
  try {
    const userToken = extractTokenFromRequest(req);
    if (!userToken) {
      return res.status(401).json({ error: "Authentication token is required" });
    }
    const data = await fetchFromAPI("/analytics/location-stats/summary", userToken);
    res.json(data);
  } catch (error) {
    console.error("Error in handleLocationStatsSummary:", error);
    res.status(500).json({ error: "Failed to fetch summary stats" });
  }
};

export const handleLocationStatsDistrict: RequestHandler = async (req, res) => {
  try {
    const userToken = extractTokenFromRequest(req);
    if (!userToken) {
      return res.status(401).json({ error: "Authentication token is required" });
    }
    const data = await fetchFromAPI("/analytics/location-stats/district", userToken);
    res.json(data);
  } catch (error) {
    console.error("Error in handleLocationStatsDistrict:", error);
    res.status(500).json({ error: "Failed to fetch district stats" });
  }
};

export const handleLocationStatsQuest: RequestHandler = async (req, res) => {
  try {
    const userToken = extractTokenFromRequest(req);
    if (!userToken) {
      return res.status(401).json({ error: "Authentication token is required" });
    }
    const data = await fetchFromAPI("/analytics/location-stats/quest", userToken);
    res.json(data);
  } catch (error) {
    console.error("Error in handleLocationStatsQuest:", error);
    res.status(500).json({ error: "Failed to fetch quest stats" });
  }
};

export const handleLocationStatsTime: RequestHandler = async (req, res) => {
  try {
    const unit = (req.query.unit as string) || "day";
    const userToken = extractTokenFromRequest(req);
    if (!userToken) {
      return res.status(401).json({ error: "Authentication token is required" });
    }
    const data = await fetchFromAPI(`/analytics/location-stats/time?unit=${unit}`, userToken);
    res.json(data);
  } catch (error) {
    console.error("Error in handleLocationStatsTime:", error);
    res.status(500).json({ error: "Failed to fetch time stats" });
  }
};

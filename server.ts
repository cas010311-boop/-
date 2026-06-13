import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing for JSON transfers of photos in base64 formats
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // File path for global persistent storage on the workspace filesystem
  const DATA_FILE = path.join(process.cwd(), "src", "data_custom.json");

  // API Route: Get portfolio settings
  app.get("/api/portfolio/data", (req, res) => {
    if (fs.existsSync(DATA_FILE)) {
      try {
        const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
        const data = JSON.parse(fileContent);
        return res.json(data);
      } catch (e) {
        console.error("Error reading data_custom.json:", e);
        return res.json({});
      }
    }
    return res.json({});
  });

  // API Route: Save Profile
  app.post("/api/portfolio/save-profile", (req, res) => {
    const { profile } = req.body;
    let currentData: any = {};
    if (fs.existsSync(DATA_FILE)) {
      try {
        const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
        currentData = JSON.parse(fileContent);
      } catch (e) {}
    }
    currentData.profile = profile;

    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(currentData, null, 2), "utf-8");
      res.json({ success: true });
    } catch (err) {
      console.error("Failed to save profile on server:", err);
      res.status(500).json({ error: "Failed to save profile on server" });
    }
  });

  // API Route: Save Photos
  app.post("/api/portfolio/save-photos", (req, res) => {
    const { photos } = req.body;
    let currentData: any = {};
    if (fs.existsSync(DATA_FILE)) {
      try {
        const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
        currentData = JSON.parse(fileContent);
      } catch (e) {}
    }
    currentData.photos = photos;

    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(currentData, null, 2), "utf-8");
      res.json({ success: true });
    } catch (err) {
      console.error("Failed to save photos on server:", err);
      res.status(500).json({ error: "Failed to save photos on server" });
    }
  });

  // Serve static metadata or assets if requested, or integrate Vite
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

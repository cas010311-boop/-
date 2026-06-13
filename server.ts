import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing for JSON transfers of photos in base64 formats
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Load firebase credentials dynamically from workspace config
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (!fs.existsSync(configPath)) {
    throw new Error("firebase-applet-config.json is missing! Please set up Firebase first.");
  }
  
  const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  const firebaseApp = initializeApp(firebaseConfig);
  // Get database instance with specific database id from configuration
  const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

  // Validate connection to Firestore on initialization
  try {
    const testRef = doc(db, "portfolio", "connection_test");
    await setDoc(testRef, { lastActive: new Date().toISOString() }, { merge: true });
    console.log("Firebase Firestore Connection Verified Successfully!");
  } catch (error) {
    console.error("Warning: Initial connection to Firestore had issues:", error);
  }

  // API Route: Get portfolio settings
  app.get("/api/portfolio/data", async (req, res) => {
    try {
      const docRef = doc(db, "portfolio", "global_config");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return res.json(docSnap.data());
      }
      return res.json({});
    } catch (e) {
      console.error("Error fetching data from Firestore:", e);
      return res.status(500).json({ error: "Failed to read portfolio from database" });
    }
  });

  // API Route: Save Profile
  app.post("/api/portfolio/save-profile", async (req, res) => {
    const { profile } = req.body;
    try {
      const docRef = doc(db, "portfolio", "global_config");
      await setDoc(docRef, { profile }, { merge: true });
      res.json({ success: true });
    } catch (err) {
      console.error("Failed to save profile to Firestore:", err);
      res.status(500).json({ error: "Failed to save profile to database" });
    }
  });

  // API Route: Save Photos
  app.post("/api/portfolio/save-photos", async (req, res) => {
    const { photos } = req.body;
    try {
      const docRef = doc(db, "portfolio", "global_config");
      await setDoc(docRef, { photos }, { merge: true });
      res.json({ success: true });
    } catch (err) {
      console.error("Failed to save photos to Firestore:", err);
      res.status(500).json({ error: "Failed to save photos to database" });
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

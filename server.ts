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

  // API Route: Proxy Instagram media requests using unblocked embed meta scraping to bypass browser hotlinking/CORS 403 blocks
  app.get("/api/instagram-image", async (req, res) => {
    const imageUrl = req.query.url as string;
    if (!imageUrl) {
      return res.status(400).send("Source URL is required");
    }

    try {
      // Parse out post ID from Instagram post/reel/tv URL
      const match = imageUrl.match(/instagram\.com\/(p|reel|tv)\/([^/?#]+)/i);
      if (!match || !match[2]) {
        return res.status(400).send("Invalid Instagram URL");
      }
      const postId = match[2];
      const embedUrl = `https://www.instagram.com/p/${postId}/embed/`;

      // Fetch the public embed page designed for search engines/social previews (never blocked)
      const pageResponse = await fetch(embedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      if (!pageResponse.ok) {
        console.error(`Instagram embed fetch failed: ${pageResponse.status} ${pageResponse.statusText}`);
        return res.status(pageResponse.status).send(`Failed to grab image metadata: ${pageResponse.statusText}`);
      }

      const html = await pageResponse.text();

      // Find the og:image meta tag
      const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) || 
                           html.match(/<meta\s+content="([^"]+)"\s+property="og:image"/i) ||
                           html.match(/meta\s+name="twitter:image"\s+content="([^"]+)"/i);

      let directCdnUrl: string | null = null;
      if (ogImageMatch && ogImageMatch[1]) {
        directCdnUrl = ogImageMatch[1]
          .replace(/&amp;/g, "&")
          .replace(/\\u0026/g, "&")
          .replace(/\\/g, "");
      }

      if (!directCdnUrl) {
        // Fallback: search for display_url in post JSON payloads
        const displayUrlMatch = html.match(/"display_url"\s*:\s*"([^"]+)"/);
        if (displayUrlMatch && displayUrlMatch[1]) {
          directCdnUrl = displayUrlMatch[1]
            .replace(/&amp;/g, "&")
            .replace(/\\u0026/g, "&")
            .replace(/\\/g, "");
        }
      }

      if (!directCdnUrl) {
        console.error("Could not parse image URL from Instagram embed page for post:", postId);
        return res.status(404).send("Image URL not found in post metadata");
      }

      // Download the clean image from Instagram CDN
      const imgRes = await fetch(directCdnUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
        }
      });

      if (!imgRes.ok) {
        console.error(`Failed to stream image from CDN logic: ${imgRes.status}`);
        return res.status(imgRes.status).send("Failed to stream image from Instagram CDN");
      }

      const contentType = imgRes.headers.get("content-type") || "image/jpeg";
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=604800"); // Cache inside CDN & browser for 7 days

      const arrayBuffer = await imgRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return res.send(buffer);
    } catch (e: any) {
      console.error("Instagram proxy server error:", e);
      return res.status(500).send(`Server error: ${e.message}`);
    }
  });

  // API Route: Get portfolio settings
  app.get("/api/portfolio/data", async (req, res) => {
    try {
      const profileRef = doc(db, "portfolio", "profile");
      const photosRef = doc(db, "portfolio", "photos");

      const [profileSnap, photosSnap] = await Promise.all([
        getDoc(profileRef),
        getDoc(photosRef)
      ]);

      const data: any = {};
      if (profileSnap.exists()) {
        data.profile = profileSnap.data().profile;
      }
      if (photosSnap.exists()) {
        data.photos = photosSnap.data().photos;
      }

      // Legacy fallback migration: if the split documents don't exist yet, check the old combined config document
      if (!data.profile || !data.photos) {
        const legacyRef = doc(db, "portfolio", "global_config");
        const legacySnap = await getDoc(legacyRef);
        if (legacySnap.exists()) {
          const legacyData = legacySnap.data();
          if (!data.profile && legacyData.profile) {
            data.profile = legacyData.profile;
          }
          if (!data.photos && legacyData.photos) {
            data.photos = legacyData.photos;
          }
        }
      }

      // Self-healing profile image correction to always map to the downloaded public/profile.jpg
      if (data.profile) {
        if (data.profile.profileImage !== "profile.jpg") {
          data.profile.profileImage = "profile.jpg";
          try {
            await setDoc(profileRef, { profile: data.profile }, { merge: true });
            console.log("Self-healed profileImage in Firestore!");
          } catch (err) {
            console.error("Failed to self-heal profileImage in Firestore:", err);
          }
        }
      }

      return res.json(data);
    } catch (e) {
      console.error("Error fetching data from Firestore:", e);
      return res.status(500).json({ error: "Failed to read portfolio from database" });
    }
  });

  // API Route: Save Profile
  app.post("/api/portfolio/save-profile", async (req, res) => {
    const { profile } = req.body;
    try {
      const docRef = doc(db, "portfolio", "profile");
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
      const docRef = doc(db, "portfolio", "photos");
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

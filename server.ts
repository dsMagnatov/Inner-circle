import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Video proxy route to pipe direct Google Drive streams bypassing virus warnings and CORS
  app.get("/api/video-proxy", async (req, res) => {
    const id = req.query.id as string;
    if (!id) {
      res.status(400).send("Missing id parameter");
      return;
    }

    try {
      const initialUrl = `https://drive.google.com/uc?export=download&id=${id}`;
      let downloadUrl = initialUrl;

      // Fetch the Google Drive confirmation page
      const initRes = await fetch(initialUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        }
      });

      const contentType = initRes.headers.get('content-type') || '';
      
      if (contentType.includes('text/html')) {
        const html = await initRes.text();
        
        let confirmToken = "";
        const match1 = html.match(/confirm=([a-zA-Z0-9_-]+)/);
        const match2 = html.match(/name="confirm"\s+value="([^"]+)"/i);
        const match3 = html.match(/value="([^"]+)"\s+name="confirm"/i);
        const match4 = html.match(/id="confirm_token"\s+value="([^"]+)"/i);

        if (match1) {
          confirmToken = match1[1];
        } else if (match2) {
          confirmToken = match2[1];
        } else if (match3) {
          confirmToken = match3[1];
        } else if (match4) {
          confirmToken = match4[1];
        }

        if (confirmToken) {
          downloadUrl = `https://drive.google.com/uc?export=download&confirm=${confirmToken}&id=${id}`;
        }
      }

      // Prepare headers, including Range header for absolute frame-by-frame seeking/scrubbing
      const headers: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      };
      
      if (req.headers.range) {
        headers['Range'] = req.headers.range;
      }

      const streamRes = await fetch(downloadUrl, { headers });

      // Forward status and native key headers (Range, Content-Length, Content-Type)
      res.status(streamRes.status);
      
      for (const [key, val] of streamRes.headers.entries()) {
        const lowerKey = key.toLowerCase();
        if (['content-type', 'content-length', 'content-range', 'accept-ranges', 'cache-control'].includes(lowerKey)) {
          res.setHeader(key, val);
        }
      }

      // Stream the body chunks seamlessly to the response
      if (streamRes.body) {
        const reader = streamRes.body.getReader();
        const push = async () => {
          const { done, value } = await reader.read();
          if (done) {
            res.end();
            return;
          }
          res.write(value);
          push();
        };
        await push();
      } else {
        res.end();
      }
    } catch (error) {
      console.error("Video proxy error:", error);
      if (!res.headersSent) {
        res.status(500).send("Streaming failed");
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

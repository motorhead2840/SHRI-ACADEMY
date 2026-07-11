import { Request, Response, NextFunction } from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import TurndownService from "turndown";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, "../../../sri-platform/dist/public");

/**
 * Middleware for content negotiation to convert pre-rendered HTML to Markdown.
 * Intercepts requests with the header "Accept: text/markdown".
 */
export async function contentNegotiation(req: Request, res: Response, next: NextFunction): Promise<void> {
  const acceptHeader = req.headers["accept"] || "";
  
  // Only process if Accept header contains text/markdown and is not an API route
  if (
    typeof acceptHeader === "string" &&
    acceptHeader.includes("text/markdown") &&
    !req.path.startsWith("/api")
  ) {
    const requestedPath = req.path;
    const normalized = requestedPath.trim().replace(/^\/+|\/+$/g, "");
    
    // Construct the path to the pre-rendered static HTML index.html
    const targetFile = normalized === "" 
      ? path.join(PUBLIC_DIR, "index.html")
      : path.join(PUBLIC_DIR, normalized, "index.html");
      
    // Security: Prevent path traversal attacks
    const resolvedPath = path.resolve(targetFile);
    if (!resolvedPath.startsWith(PUBLIC_DIR)) {
      return next();
    }
    
    try {
      const htmlContent = await fs.readFile(resolvedPath, "utf-8");
      
      // Match the pre-rendered static SEO content block for high-signal extraction
      const staticBlockRegex = /<div\s+aria-hidden="true"\s+style="position:\s*absolute;\s*left:\s*-9999px;[^"]*">([\s\S]*?)<\/div>/i;
      const match = htmlContent.match(staticBlockRegex);
      
      let contentToConvert = htmlContent;
      if (match && match[1]) {
        contentToConvert = match[1];
      }
      
      // Convert HTML to Markdown
      const turndownService = new TurndownService();
      const markdown = turndownService.turndown(contentToConvert);
      
      res.setHeader("Content-Type", "text/markdown; charset=utf-8");
      res.send(markdown);
      return;
    } catch (err) {
      // File not found or couldn't be read — pass through to let standard routing handle it
    }
  }
  
  next();
}

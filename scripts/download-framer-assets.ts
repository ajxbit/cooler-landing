import { mkdir, writeFile, readFile, readdir } from "fs/promises";
import path from "path";

const HTML_DIR = path.join(process.cwd(), "html");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const FRAMER_ASSETS_DIR = path.join(PUBLIC_DIR, "framer");

async function extractUrls(): Promise<Set<string>> {
  const urls = new Set<string>();
  const files = await readdir(HTML_DIR);

  for (const file of files) {
    if (!file.endsWith(".html")) continue;
    const content = await readFile(path.join(HTML_DIR, file), "utf-8");

    // Match framerusercontent.com URLs
    const matches = content.matchAll(/https:\/\/framerusercontent\.com\/[^"'<>\s]+/g);
    for (const match of matches) {
      urls.add(match[0]);
    }
  }

  return urls;
}

async function downloadAsset(url: string): Promise<{ url: string; localPath: string; success: boolean }> {
  try {
    // Parse URL to get path
    const urlObj = new URL(url);
    const urlPath = urlObj.pathname;

    // Determine local path
    let localPath: string;
    if (urlPath.startsWith("/assets/")) {
      localPath = path.join(FRAMER_ASSETS_DIR, "assets", urlPath.replace("/assets/", ""));
    } else if (urlPath.startsWith("/sites/")) {
      localPath = path.join(FRAMER_ASSETS_DIR, "sites", urlPath.replace("/sites/", ""));
    } else if (urlPath.startsWith("/images/")) {
      localPath = path.join(FRAMER_ASSETS_DIR, "images", urlPath.replace("/images/", ""));
    } else {
      localPath = path.join(FRAMER_ASSETS_DIR, "other", urlPath.replace(/^\//, ""));
    }

    // Create directory
    await mkdir(path.dirname(localPath), { recursive: true });

    // Download file
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to download ${url}: ${response.status}`);
      return { url, localPath, success: false };
    }

    const buffer = await response.arrayBuffer();
    await writeFile(localPath, Buffer.from(buffer));

    console.log(`Downloaded: ${url}`);
    return { url, localPath, success: true };
  } catch (error) {
    console.error(`Error downloading ${url}:`, error);
    return { url, localPath: "", success: false };
  }
}

async function updateHtmlFiles(urlMap: Map<string, string>): Promise<void> {
  const files = await readdir(HTML_DIR);

  for (const file of files) {
    if (!file.endsWith(".html")) continue;
    let content = await readFile(path.join(HTML_DIR, file), "utf-8");

    // Replace URLs with local paths
    for (const [url, localPath] of urlMap) {
      // Convert absolute local path to relative web path
      const webPath = "/" + path.relative(PUBLIC_DIR, localPath);
      content = content.split(url).join(webPath);
    }

    await writeFile(path.join(HTML_DIR, file), content);
    console.log(`Updated: ${file}`);
  }
}

async function updateCopyrightYear(): Promise<void> {
  const currentYear = new Date().getFullYear();
  console.log(`\nUpdating copyright year to ${currentYear}...`);

  // Find all JS/MJS files in framer directory
  async function findJsFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          files.push(...(await findJsFiles(fullPath)));
        } else if (entry.name.endsWith(".js") || entry.name.endsWith(".mjs") || entry.name.endsWith(".json")) {
          files.push(fullPath);
        }
      }
    } catch {
      // Directory might not exist
    }
    return files;
  }

  const jsFiles = await findJsFiles(FRAMER_ASSETS_DIR);
  let updatedCount = 0;

  for (const file of jsFiles) {
    let content = await readFile(file, "utf-8");
    // Check for both UTF-8 © and escaped \xa9 forms
    if (content.includes("2025 COOLER")) {
      content = content.replace(/© 2025 COOLER/g, `© ${currentYear} COOLER`);
      content = content.replace(/\\xa9 2025 COOLER/g, `\\xa9 ${currentYear} COOLER`);
      await writeFile(file, content);
      updatedCount++;
      console.log(`Updated copyright in: ${path.relative(FRAMER_ASSETS_DIR, file)}`);
    }
  }

  console.log(`Updated copyright year in ${updatedCount} files`);
}

async function main() {
  console.log("Extracting URLs from HTML files...");
  const urls = await extractUrls();
  console.log(`Found ${urls.size} unique URLs`);

  // Create framer assets directory
  await mkdir(FRAMER_ASSETS_DIR, { recursive: true });

  console.log("\nDownloading assets...");
  const urlMap = new Map<string, string>();
  const batchSize = 10;
  const urlArray = Array.from(urls);

  for (let i = 0; i < urlArray.length; i += batchSize) {
    const batch = urlArray.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(downloadAsset));

    for (const result of results) {
      if (result.success) {
        urlMap.set(result.url, result.localPath);
      }
    }

    console.log(`Progress: ${Math.min(i + batchSize, urlArray.length)}/${urlArray.length}`);
  }

  console.log(`\nSuccessfully downloaded ${urlMap.size} assets`);

  console.log("\nUpdating HTML files...");
  await updateHtmlFiles(urlMap);

  // Update copyright year in downloaded JS files
  await updateCopyrightYear();

  console.log("\nDone!");
}

main().catch(console.error);

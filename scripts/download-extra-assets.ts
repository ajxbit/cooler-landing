import { mkdir, writeFile, readFile, readdir } from "fs/promises";
import path from "path";

const APP_DIR = path.join(process.cwd(), "app");
const HTML_DIR = path.join(process.cwd(), "html");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const FRAMER_IMAGES_DIR = path.join(PUBLIC_DIR, "framer", "images");
const FONTS_DIR = path.join(PUBLIC_DIR, "fonts", "inter-tight");
const SCRIPTS_DIR = path.join(PUBLIC_DIR, "scripts");


// Layout images
const LAYOUT_IMAGES = [
  "https://framerusercontent.com/images/smxDmEvqfnCqBNVDGnJO0RX8.png",
  "https://framerusercontent.com/images/noV1dbu9ddlbs12fvfz0RBpJg.png"
];

async function downloadFile(url: string, destPath: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    const buffer = await response.arrayBuffer();
    await mkdir(path.dirname(destPath), { recursive: true });
    await writeFile(destPath, Buffer.from(buffer));
    console.log(`Downloaded ${url} to ${destPath}`);
    return true;
  } catch (error) {
    console.error(`Error downloading ${url}:`, error);
    return false;
  }
}

async function processLayout() {
  const layoutPath = path.join(APP_DIR, "layout.tsx");
  let content = await readFile(layoutPath, "utf-8");
  
  for (const url of LAYOUT_IMAGES) {
    const filename = path.basename(url);
    const localPath = path.join(FRAMER_IMAGES_DIR, filename);
    const publicPath = `/framer/images/${filename}`;
    
    await downloadFile(url, localPath);
    content = content.replace(url, publicPath);
  }
  
  await writeFile(layoutPath, content);
  console.log("Updated app/layout.tsx");
}

async function processHtmlFonts() {
  const files = await readdir(HTML_DIR);
  
  for (const file of files) {
    if (!file.endsWith(".html")) continue;
    const filePath = path.join(HTML_DIR, file);
    let content = await readFile(filePath, "utf-8");
    
    // Regex to find Google Fonts URLs
    const fontRegex = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g;
    let match;
    const replacements = new Map<string, string>();
    
    while ((match = fontRegex.exec(content)) !== null) {
      const url = match[1];
      const filename = path.basename(url);
      // Clean filename
      const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
      const localPath = path.join(FONTS_DIR, cleanFilename);
      const publicPath = `/fonts/inter-tight/${cleanFilename}`;
      
      if (!replacements.has(url)) {
        await downloadFile(url, localPath);
        replacements.set(url, publicPath);
      }
    }
    
    for (const [url, localPath] of replacements) {
       content = content.replaceAll(url, localPath);
    }
    
    // Handle es-module-shims
    const shimUrl = "https://ga.jspm.io/npm:es-module-shims@1.6.3/dist/es-module-shims.js";
    if (content.includes(shimUrl)) {
        const localShimPath = path.join(SCRIPTS_DIR, "es-module-shims.js");
        const publicShimPath = "/scripts/es-module-shims.js";
        await downloadFile(shimUrl, localShimPath);
        content = content.replaceAll(shimUrl, publicShimPath);
    }

    // Remove Framer editor script (various forms)
    content = content.replace(/<script>try\{if\(localStorage\.get\("__framer_force_showing_editorbar_since"\)\)[\s\S]*?<\/script>/, "");
    content = content.replace(/const \{ createEditorBar \} = await import\("https:\/\/framer\.com\/edit\/init\.mjs"\)/g, "// Editor bar removed");

    // Remove Framer events script
    content = content.replace(/<script async src="https:\/\/events\.framer\.com\/script\?v=2".*?><\/script>/g, "");
    
    // Remove preconnects to fonts (just in case they were missed)
    content = content.replace(/<link href="https:\/\/fonts\.gstatic\.com" rel="preconnect" crossorigin>/g, "");


    
    await writeFile(filePath, content);
    console.log(`Updated ${file}`);
  }
}

async function main() {
  await processLayout();
  await processHtmlFonts();
}

main().catch(console.error);

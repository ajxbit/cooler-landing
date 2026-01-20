import { readFile } from "fs/promises";
import path from "path";

interface FramerPageProps {
  htmlPath: string;
}

const PAGES_TO_PREFETCH = ["/", "/ai", "/hosts", "/privacy", "/terms"];

export default async function FramerPage({ htmlPath }: FramerPageProps) {
  const fullPath = path.join(process.cwd(), htmlPath);
  let htmlContent = await readFile(fullPath, "utf-8");

  // Generate prefetch links for all pages
  const prefetchLinks = PAGES_TO_PREFETCH.map(
    (page) => `<link rel="prefetch" href="${page}" />`
  ).join("\n");

  // Inject prefetch links into the head
  htmlContent = htmlContent.replace(
    "</head>",
    `${prefetchLinks}\n</head>`
  );

  return (
    <html
      lang="en-US"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: htmlContent
          .replace(/^<!doctype html>\s*<html[^>]*>/i, "")
          .replace(/<\/html>\s*$/i, ""),
      }}
    />
  );
}

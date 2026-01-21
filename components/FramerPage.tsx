import { readFile } from "fs/promises";
import path from "path";
import FramerHtml from "./FramerHtml";

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
  htmlContent = htmlContent.replace("</head>", `${prefetchLinks}\n</head>`);

  // Fix relative links to absolute paths for Next.js routing
  htmlContent = htmlContent.replace(/href="\.\/"/g, 'href="/"');
  htmlContent = htmlContent.replace(/href="\.\//g, 'href="/');

  // Update copyright year to current year
  const currentYear = new Date().getFullYear();
  htmlContent = htmlContent.replace(/© 2025 COOLER/g, `© ${currentYear} COOLER`);

  // Extract head content (styles, fonts, links)
  const headMatch = htmlContent.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const headContent = headMatch ? headMatch[1] : "";

  // Extract style tags from head
  const styleRegex = /<style[^>]*>[\s\S]*?<\/style>/gi;
  const styles = headContent.match(styleRegex) || [];

  // Extract link tags (fonts, preloads)
  const linkRegex = /<link[^>]*>/gi;
  const links = headContent.match(linkRegex) || [];

  // Extract body content
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : "";

  return (
    <html lang="en-US" suppressHydrationWarning>
      <head>
        {/* Inject Framer styles */}
        {styles.map((style, i) => (
          <style
            key={i}
            dangerouslySetInnerHTML={{ __html: style.replace(/<\/?style[^>]*>/gi, "") }}
          />
        ))}
        {/* Inject Framer links (fonts, preloads) */}
        {links.map((link, i) => {
          // Parse link attributes
          const hrefMatch = link.match(/href="([^"]*)"/);
          const relMatch = link.match(/rel="([^"]*)"/);
          const asMatch = link.match(/as="([^"]*)"/);
          const crossoriginMatch = link.match(/crossorigin/);
          const mediaMatch = link.match(/media="([^"]*)"/);

          if (!hrefMatch) return null;

          return (
            <link
              key={i}
              href={hrefMatch[1]}
              rel={relMatch?.[1]}
              as={asMatch?.[1]}
              crossOrigin={crossoriginMatch ? "anonymous" : undefined}
              media={mediaMatch?.[1]}
            />
          );
        })}
      </head>
      <body>
        <FramerHtml bodyContent={bodyContent} />
      </body>
    </html>
  );
}

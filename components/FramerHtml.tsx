"use client";

import { useEffect, useRef } from "react";

interface FramerHtmlProps {
  bodyContent: string;
}

export default function FramerHtml({ bodyContent }: FramerHtmlProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const container = containerRef.current;
    if (!container) return;

    // Collect all scripts and sort them by execution order
    const scripts = Array.from(container.querySelectorAll("script"));

    // Execute scripts in order
    const executeScript = (script: HTMLScriptElement): Promise<void> => {
      return new Promise((resolve) => {
        // Skip data scripts (type="framer/appear" etc.)
        if (script.type && script.type !== "text/javascript" && script.type !== "module") {
          resolve();
          return;
        }

        const newScript = document.createElement("script");

        // Copy all attributes
        Array.from(script.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });

        // Handle load/error for external scripts
        if (script.src) {
          newScript.onload = () => resolve();
          newScript.onerror = () => resolve();
        }

        // Copy inline script content
        if (script.textContent && !script.src) {
          newScript.textContent = script.textContent;
        }

        // Replace old script with new one
        script.parentNode?.replaceChild(newScript, script);

        // For inline scripts, resolve immediately
        if (!script.src) {
          resolve();
        }
      });
    };

    // Execute scripts sequentially for proper ordering
    const executeAllScripts = async () => {
      for (const script of scripts) {
        await executeScript(script);
      }
    };

    executeAllScripts();
  }, []);

  return (
    <div
      ref={containerRef}
      id="framer-root"
      style={{ minHeight: "100vh" }}
      dangerouslySetInnerHTML={{ __html: bodyContent }}
    />
  );
}

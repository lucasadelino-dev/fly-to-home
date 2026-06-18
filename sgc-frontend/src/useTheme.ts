import { useState, useEffect } from "react";

export function useTheme(): "dark" | "light" {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (document.documentElement.getAttribute("data-theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const t = document.documentElement.getAttribute("data-theme") as "dark" | "light";
      setTheme(t || "dark");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return theme;
}

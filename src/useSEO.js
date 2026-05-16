import { useEffect } from "react";

/**
 * useSEO — sets <title>, <meta name="description">, and <link rel="canonical">
 * Call once at the top of each page component.
 */
export function useSEO({ title, description, canonical }) {
  useEffect(() => {
    // Title
    document.title = title;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // Canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", canonical);

    // Open Graph
    setOGMeta("og:title", title);
    setOGMeta("og:description", description);
    setOGMeta("og:url", canonical);
    setOGMeta("og:type", "website");
    setOGMeta("og:site_name", "Filtero");
  }, [title, description, canonical]);
}

function setOGMeta(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

import { useEffect } from "react";

type SeoProps = {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterSite?: string;
};

function upsertMeta(selector: string, attr: "name" | "property", value: string) {
  const existing = document.querySelector<HTMLMetaElement>(`${selector}`);
  if (existing) {
    existing.setAttribute(attr, value.split("=")[0]);
    const content = value.split("=")[1] ?? "";
    if (content) existing.setAttribute("content", content);
    return existing;
  }
  const meta = document.createElement("meta");
  const [k, v] = value.split("=");
  meta.setAttribute(attr, k);
  meta.setAttribute("content", v ?? "");
  document.head.appendChild(meta);
  return meta;
}

function setNamedMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setPropertyMeta(prop: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${prop}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", prop);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export const Seo = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  twitterCard = "summary_large_image",
  twitterSite,
}: SeoProps) => {
  useEffect(() => {
    if (title) document.title = title;
    if (description) setNamedMeta("description", description);
    const mergedKeywords = Array.from(
      new Set(["form builder", ...(keywords ?? [])])
    );
    setNamedMeta("keywords", mergedKeywords.join(", "));

    // Open Graph
    setPropertyMeta("og:type", "website");
    setPropertyMeta("og:title", ogTitle || title || "Form Builder");
    if (ogDescription || description) {
      setPropertyMeta("og:description", ogDescription || description || "");
    }
    if (ogImage) setPropertyMeta("og:image", ogImage);

    // Twitter
    setNamedMeta("twitter:card", twitterCard);
    if (twitterSite) setNamedMeta("twitter:site", twitterSite);
    if (ogImage) setNamedMeta("twitter:image", ogImage);

    // JSON-LD (SoftwareApplication)
    const existingScript = document.getElementById("seo-json-ld") as HTMLScriptElement | null;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: title || "Modurator Form Builder",
      applicationCategory: "DeveloperApplication",
      description: description || "Free form builder with drag & drop to create forms and CRUD modules.",
      offers: { "@type": "Offer", price: "0" },
      url: window.location.href,
      keywords: mergedKeywords.join(", "),
    };
    const script: HTMLScriptElement = existingScript ?? document.createElement("script");
    script.id = "seo-json-ld";
    script.setAttribute("type", "application/ld+json");
    script.textContent = JSON.stringify(jsonLd);
    if (!existingScript) document.head.appendChild(script);
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, twitterCard, twitterSite]);

  return null;
};

export default Seo;
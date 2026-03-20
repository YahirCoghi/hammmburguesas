const rawWhatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
const derivedVercelUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (derivedVercelUrl ? `https://${derivedVercelUrl}` : "http://localhost:3000");

export const siteConfig = {
  brand: "HaMMburguesas",
  instagramHandle: "@hammbburguesas",
  instagramUrl: "https://www.instagram.com/hammbburguesas/",
  location: "San Jose, Costa Rica",
  hours: "LUN-DOM 1PM-10PM | VIE-SAB 1PM-11PM",
  whatsappNumber: rawWhatsappNumber.replace(/\D/g, ""),
  siteUrl: rawSiteUrl.replace(/\/$/, ""),
};

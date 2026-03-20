import type { Metadata } from "next";
import { Epilogue, Manrope } from "next/font/google";

import { siteConfig } from "@/lib/site-config";

import "./globals.css";

const epilogue = Epilogue({
  subsets: ["latin"],
  variable: "--font-epilogue",
  weight: ["400", "700", "800", "900"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: "HaMMburguesas | Burgers con carrito y checkout por WhatsApp",
  description:
    "Sitio web moderno para HaMMburguesas con menu visual, inventario real, extras configurables y confirmacion de pedido por WhatsApp.",
  openGraph: {
    title: "HaMMburguesas",
    description:
      "Menu moderno con inventario real, extras configurables y checkout conversacional.",
    url: siteConfig.siteUrl,
    siteName: "HaMMburguesas",
    locale: "es_CR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HaMMburguesas",
    description:
      "Burgers, inventario real y checkout por WhatsApp en una experiencia moderna.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${epilogue.variable} ${manrope.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

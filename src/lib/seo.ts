import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://deluxe-playlist.vercel.app/";

export const seoConfig = {
  title: "डीलक्स थाली | Deluxe Playlist",
  description:
    "Experience the ultimate music playlist with Deluxe Thali. Curated tracks for every mood, seamlessly played with YouTube integration.",
  keywords: [
    "music",
    "playlist",
    "deluxe",
    "thali",
    "youtube",
    "music player",
    "curated playlist",
  ],
  author: "Deluxe Playlist",
  twitter: {
    handle: "@deluxeplaylist",
    site: "@deluxeplaylist",
  },
  openGraph: {
    type: "website" as const,
    locale: "en_US",
    url: baseUrl,
    siteName: "Deluxe Playlist",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Deluxe Playlist - डीलक्स थाली",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: seoConfig.title,
      template: `%s | ${seoConfig.title}`,
    },
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    authors: [{ name: seoConfig.author }],
    creator: seoConfig.author,
    publisher: seoConfig.author,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      type: seoConfig.openGraph.type,
      locale: seoConfig.openGraph.locale,
      url: seoConfig.openGraph.url,
      siteName: seoConfig.openGraph.siteName,
      title: seoConfig.title,
      description: seoConfig.description,
      images: seoConfig.openGraph.images,
    },
    twitter: {
      card: "summary_large_image",
      title: seoConfig.title,
      description: seoConfig.description,
      creator: seoConfig.twitter.handle,
      site: seoConfig.twitter.site,
      images: seoConfig.openGraph.images,
    },
    icons: seoConfig.icons,
    manifest: seoConfig.manifest,
    alternates: {
      canonical: baseUrl,
    },
  };
}

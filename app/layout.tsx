import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cooler",
  description: "Podcasts are better together. Cooler is a podcast player that makes listening fun and social.",
  icons: {
    icon: "/framer/images/smxDmEvqfnCqBNVDGnJO0RX8.png",
  },
  openGraph: {
    type: "website",
    title: "Cooler",
    description: "Podcasts are better together. Cooler is a podcast player that makes listening fun and social.",
    images: ["/framer/images/noV1dbu9ddlbs12fvfz0RBpJg.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cooler",
    description: "Podcasts are better together. Cooler is a podcast player that makes listening fun and social.",
    images: ["/framer/images/noV1dbu9ddlbs12fvfz0RBpJg.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

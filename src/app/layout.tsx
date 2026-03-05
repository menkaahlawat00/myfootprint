import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Using Space Grotesk for --font-display as an interim fallback
 * until Clash Display woff2 files are available. Space Grotesk is a bold
 * geometric sans that works well for headlines at heavy weights.
 */
const clashDisplayFallback = Space_Grotesk({
  variable: "--font-clash-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "My FootPrint",
  description: "Understand and reduce your carbon footprint",
};

const clerkEnabled =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("dummy");

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const inner = (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${clashDisplayFallback.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );

  if (clerkEnabled) {
    const { ClerkProvider } = await import("@clerk/nextjs");
    return <ClerkProvider>{inner}</ClerkProvider>;
  }

  return inner;
}

import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Sora, DM_Sans } from "next/font/google";
import { AppProviders } from "./providers";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#00AEEF",
};

export const metadata: Metadata = {
  title: "MYHitch Pass — Discover & Book Live Events in Australia",
  description:
    "MYHitch Pass is Australia's premium event discovery and ticketing platform for concerts, music festivals, sports, theatre, and live tours. Secure tickets, instant digital passes.",
  keywords:
    "event tickets, concert tickets australia, festival tickets, live events, ticketing platform, MYHitch Pass, become an organiser, sell event tickets",
  authors: [{ name: "MYHitch Pass Australia" }],
  robots: "index, follow",
  metadataBase: new URL("https://myhitchpass.com.au"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "MYHitch Pass",
    title: "MYHitch Pass — Discover & Book Live Events",
    description:
      "Browse live concerts, music festivals, sports, and tours. Secure ticketing and instant digital passes.",
    url: "https://myhitchpass.com.au/",
    images: [
      {
        url: "https://myhitchpass.com.au/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "MYHitch Pass — Discover & Book Live Events",
    description:
      "Browse live concerts, music festivals, sports, and tours. Secure ticketing and instant digital passes.",
    images: ["https://myhitchpass.com.au/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" className={`${jakarta.variable} ${jetbrainsMono.variable} ${sora.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "MYHitch Pass",
              url: "https://myhitchpass.com.au/",
              logo: "https://myhitchpass.com.au/og-image.png",
              description:
                "Australia's premium event discovery and ticketing platform for concerts, festivals, sports, and live tours.",
              contactPoint: {
                "@type": "ContactPoint",
                email: "support@myhitchpass.com.au",
                contactType: "customer support",
                areaServed: "AU",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "MYHitch Pass",
              url: "https://myhitchpass.com.au/",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://myhitchpass.com.au/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
        <noscript>
          <div
            style={{
              padding: "2rem",
              fontFamily: "system-ui,sans-serif",
              textAlign: "center",
            }}
          >
            <h1>MYHitch Pass</h1>
            <p>
              JavaScript is required to use MYHitch Pass. Please enable it and
              reload.
            </p>
            <p>
              Need a hand? Email{" "}
              <a href="mailto:support@myhitchpass.com.au">
                support@myhitchpass.com.au
              </a>
              .
            </p>
          </div>
        </noscript>
      </body>
    </html>
  );
}

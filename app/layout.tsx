import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { company, services } from "./content";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import MobileBar from "./components/MobileBar";
import FloatingCta from "./components/FloatingCta";
import Providers from "./components/Providers";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: "Printfix | Offset Printing & Custom Packaging in India",
    template: "%s | Printfix",
  },
  description: company.seoDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: company.legalName,
    title: "Printfix: Packaging people notice, touch, open and keep",
    description: company.seoDescription,
    url: company.url,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Printfix packaging: a green rigid perfume box with gold foil" }],
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = { themeColor: "#F4F3F0" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  legalName: company.legalName,
  url: company.url,
  logo: `${company.url}/icon-512.png`,
  description: company.description,
  email: company.email,
  telephone: "+919769277001",
  areaServed: "IN",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: "+919769277001",
    email: company.email,
    areaServed: "IN",
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
  },
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Offset Printing", url: `${company.url}/offset-printing/` } },
    ...services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, url: `${company.url}/${s.slug}/` },
    })),
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2">
          Skip to content
        </a>
        <Providers>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
          <MobileBar />
          <FloatingCta />
        </Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/error-boundary";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LogiFlow - Enterprise Logistics & Delivery Management",
    template: "%s | LogiFlow",
  },
  description:
    "Streamline your logistics operations with LogiFlow. Complete delivery management system with multi-tenant support, role-based access control, and real-time tracking.",
  keywords: [
    "logistics",
    "delivery management",
    "enterprise logistics",
    "supply chain",
    "order tracking",
    "warehouse management",
  ],
  authors: [{ name: "LogiFlow" }],
  creator: "LogiFlow",
  publisher: "LogiFlow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "LogiFlow - Enterprise Logistics & Delivery Management",
    description:
      "Streamline your logistics operations with LogiFlow. Complete delivery management system.",
    siteName: "LogiFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "LogiFlow - Enterprise Logistics & Delivery Management",
    description:
      "Streamline your logistics operations with LogiFlow. Complete delivery management system.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            themes={["light", "dark", "black", "navy", "forest"]}
            value={{
              light: "light",
              dark: "dark",
              black: "black",
              navy: "navy",
              forest: "forest",
            }}
          >
            <AuthProvider>
              {children}
            </AuthProvider>
            <Toaster duration={4000} closeButton />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

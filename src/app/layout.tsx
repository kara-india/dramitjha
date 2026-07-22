import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: { template: "%s | Dr. Amit Jha Sports Injury Clinic", default: "Dr. Amit Jha Sports Injury Clinic | Move Forward" },
  description: "Premium sports medicine, orthopaedic care and rehabilitation in Varanasi. Built around your return to movement.",
  keywords: ["sports injury", "orthopaedic", "sports medicine", "Varanasi", "rehabilitation"],
  authors: [{ name: "Dr. Amit Jha Sports Injury Clinic" }],
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#102321" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body><ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange><QueryProvider>{children}<Toaster position="top-right" richColors closeButton duration={4000} /></QueryProvider></ThemeProvider></body></html>;
}

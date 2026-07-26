import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Dr. Amit Jha Sports Injury Clinic",
    default: "Dr. Amit Jha Sports Injury Clinic | Move Forward",
  },
  description:
    "Premium sports medicine, orthopaedic care and rehabilitation in Varanasi. Fellowship-trained specialist for ACL reconstruction, arthroscopy, joint preservation and athlete rehab.",
  keywords: [
    "sports injury",
    "orthopaedic",
    "sports medicine",
    "Varanasi",
    "rehabilitation",
    "ACL reconstruction",
    "arthroscopy",
    "Dr Amit Jha",
  ],
  authors: [{ name: "Dr. Amit Jha Sports Injury Clinic" }],
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Dr. Amit Jha Sports Injury Clinic",
    description: "Premium sports medicine & orthopaedic care in Varanasi.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#102321",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={4000}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

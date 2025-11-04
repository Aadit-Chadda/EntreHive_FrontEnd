import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "./components/ConditionalLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { ToastProvider } from "@/contexts/ToastContext";

// Official EntreHive Fonts
const rocaTwo = Inter({
  variable: "--font-roca-two",
  subsets: ["latin"],
  display: "swap",
});

const canvaSans = Inter({
  variable: "--font-canva-sans", 
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EntreHive - Student Entrepreneurship Platform",
  description: "A peer-to-peer platform connecting student entrepreneurs, investors, and service providers in universities.",
  icons: {
    icon: '/Logoblacktransparent.png',
    shortcut: '/Logoblacktransparent.png',
    apple: '/Logoblacktransparent.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/Logoblacktransparent.png" />
        <link rel="shortcut icon" type="image/png" href="/Logoblacktransparent.png" />
        <link rel="apple-touch-icon" href="/Logoblacktransparent.png" />
      </head>
      <body
        className={`${rocaTwo.variable} ${canvaSans.variable} ${inter.variable} font-sans antialiased`}
        style={{backgroundColor: 'var(--background)'}}
      >
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

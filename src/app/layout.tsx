import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { BarSwitchBanner } from "@/components/cart/BarSwitchBanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Queue Less — Salta la fila",
  description:
    "Ordina in anticipo e ritira in 30 secondi. Zero coda, zero ansia.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#fafaf9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${geistSans.variable} font-sans`}>
        <AuthProvider>
          <CartProvider>
            {children}
            <BarSwitchBanner />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

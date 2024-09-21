import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import QueryStore from "@/QueryStore";
import QueryHydration from "@/QueryHydration";
import PoweredByZapper from "@/components/PoweredByZapper";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Zapper Exchange Example",
  description: "An example app to demonstrate the Zapper Exchange API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`relative ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryStore>
          <QueryHydration>{children}</QueryHydration>
        </QueryStore>

        <div className="fixed bottom-2 right-2">
          <Link href="https://zapper.xyz" target="_blank">
            <PoweredByZapper className="w-60" />
          </Link>
        </div>
      </body>
    </html>
  );
}

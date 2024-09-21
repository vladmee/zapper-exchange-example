import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import QueryStore from "@/QueryStore";
import QueryHydration from "@/QueryHydration";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryStore>
          <QueryHydration>{children}</QueryHydration>
        </QueryStore>
      </body>
    </html>
  );
}

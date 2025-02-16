import type { Metadata } from "next";
import "./globals.css";
import { ebGaramond } from "./ui/fonts";

export const metadata: Metadata = {
  title: "Mare Of The Day",
  description: "See the mares",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ebGaramond.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

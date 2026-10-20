import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "David Alter | Data Analytics & Business Intelligence",
  description: "Data analysis projects, technical skills, and operational experience. David Alter is a Computer Science student seeking Data Analyst and BI Engineering student roles.",
  referrer: "no-referrer",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

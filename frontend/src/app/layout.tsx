import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FastAPI Next.js Studio Boilerplate",
  description: "Production-grade lean boilerplate for AI and media task pipelines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}

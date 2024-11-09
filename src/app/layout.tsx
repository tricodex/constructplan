import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-kanit',
});

export const metadata: Metadata = {
  title: 'constructplan | AI-Powered Construction Planning',
  description: 'Transform your construction planning with AI-powered insights and automation',
  keywords: 'construction, planning, AI, project management, automation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${kanit.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
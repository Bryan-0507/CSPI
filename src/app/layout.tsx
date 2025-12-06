import type { Metadata } from "next";
import { PT_Sans, Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const ptSans = PT_Sans({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: '--font-pt-sans',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "CSPI",
  description: "CSPI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ptSans.variable} ${nunito.variable} font-sans antialiased`}
      >
        {children}
        <Toaster 
          richColors 
          theme="light"
          position="bottom-center"
          toastOptions={{
            style: {
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }
          }}
        />
      </body>
    </html>
  );
}
'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { BotProvider } from '@/support/BotContext';
import { UserProvider } from '@/support/UserContext';
import { TraitsProvider } from "@/support/TraitsContext";
import Script from "next/script";
import React from 'react';
import GlobalErrorListener from "@/components/GlobalErrorListener";
// const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <BotProvider>
            <TraitsProvider>
              <UserProvider>
                <GlobalErrorListener/>
                {children}
              </UserProvider>
            </TraitsProvider>
          </BotProvider>
        </ThemeProvider>
      </body>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=1P8TNHE2QZ"></Script>
      <Script id="gtag">
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-1P8TNHE2QZ');`}
      </Script>
    </html>
  );
}

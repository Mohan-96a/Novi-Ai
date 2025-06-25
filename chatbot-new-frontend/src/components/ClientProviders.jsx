'use client';

import { ThemeProvider } from "@/components/theme-provider"
import { BotProvider } from '@/support/BotContext';
import { UserProvider } from '@/support/UserContext';
import { TraitsProvider } from "@/support/TraitsContext";
import GlobalErrorListener from "@/components/GlobalErrorListener";

export default function ClientProviders({ children }) {
  return (
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
  );
} 
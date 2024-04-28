"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import CurrencyModal from "@/components/modals/currency-modal";
import { Toaster } from "@/components/ui/sonner";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
      <ModalProvider />
    </NextThemesProvider>
  );
}

export function ModalProvider() {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <CurrencyModal />;
}

export function ReactQueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = React.useState(() => new QueryClient({}));
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryClientProvider>
      <ThemeProvider>
        {children}
        <Toaster richColors position="bottom-right" />
        <ModalProvider />
      </ThemeProvider>
    </ReactQueryClientProvider>
  );
};

export default Providers;

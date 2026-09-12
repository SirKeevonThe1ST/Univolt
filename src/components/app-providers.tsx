import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { I18nProvider } from "./i18n-provider";
import type { ReactNode } from "react";
import { SimulationOverlay } from "./simulation-overlay";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 15_000, retry: 1 } },
});

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        {children}
        <SimulationOverlay />
        <Toaster
          position="top-center"
          toastOptions={{
            className: "font-sans",
            style: { background: "#FBF8F2", color: "#1A2422", border: "1px solid #D4CCBE" },
          }}
        />
      </I18nProvider>
    </QueryClientProvider>
  );
}

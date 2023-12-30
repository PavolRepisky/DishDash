import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import AppRoutes from "./AppRoutes";
import AuthProvider from "./auth/contexts/AuthProvider";
import Loader from "./core/components/Loader";
import QueryWrapper from "./core/components/QueryWrapper";
import ScrollToHashElement from "./core/components/ScrollToHashElement";
import SettingsProvider from "./core/contexts/SettingsProvider";
import SnackbarProvider from "./core/contexts/SnackbarProvider";
import usePageTracking from "./core/hooks/usePageTracking";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      suspense: true,
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});

function App() {
  usePageTracking();

  return (
    <React.Suspense fallback={<Loader />}>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <QueryWrapper>
            <SnackbarProvider>
              <AuthProvider>
                <ScrollToHashElement />
                <AppRoutes />
              </AuthProvider>
            </SnackbarProvider>
          </QueryWrapper>
        </SettingsProvider>
        <ReactQueryDevtools initialIsOpen />
      </QueryClientProvider>
    </React.Suspense>
  );
}

export default App;

// 🔹 React Query ka central client create kar rahe hain
// Ye caching, background refetch, error handling manage karega

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,              // 🔹 agar API fail ho toh 1 retry kare
      refetchOnWindowFocus: false, // 🔹 tab change pe auto refetch nahi kare
    },
  },
});
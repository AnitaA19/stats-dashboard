import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Dashboard } from "./features/dashboard/Dashboard";
import { ChatWidget } from "./features/chat/ChatWidget";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
      <ChatWidget />
    </QueryClientProvider>
  );
}

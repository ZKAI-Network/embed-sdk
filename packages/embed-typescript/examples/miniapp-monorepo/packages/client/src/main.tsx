import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./trpc";
import { httpBatchLink } from "@trpc/client";
import { MantineProvider } from '@mantine/core';

import '@mantine/core/styles.css';

import App from "./App";
import FrameProvider from "./FrameProvider";
import "./index.css";

function Root() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url:
            (import.meta.env.VITE_API_URL || "http://127.0.0.1:3000") + "/trpc",
        }),
      ],
    })
  );

  return (
    <FrameProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider>
              <App />
          </MantineProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </FrameProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);

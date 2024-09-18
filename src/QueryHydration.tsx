import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { supportedNetworksQuery } from "./hooks/use-supported-networks";

export default async function QueryHydration({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        gcTime: 2 * 60 * 1000,
      },
    },
  });
  await Promise.all([
    queryClient.prefetchQuery(supportedNetworksQuery),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
import { queryOptions, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/queries';
import { fetchSupportedNetworks } from '@/services/fetchSupportedNetworks';

export const supportedNetworksQuery = queryOptions({
  queryKey: queryKeys.supportedNetworks(),
  queryFn: fetchSupportedNetworks,
});

const useSupportedNetworks = () => {
  return useQuery(supportedNetworksQuery);
};

export default useSupportedNetworks;

import { useQuery } from '@tanstack/react-query';
import { fetchBalances } from '@/services/fetchBalances';
import { queryKeys } from '@/services/queries';

const useBalances = (address?: string) => {
  return useQuery({
    queryKey: queryKeys.balances(address),
    queryFn: fetchBalances,
    enabled: !!address,
  });
};

export default useBalances;

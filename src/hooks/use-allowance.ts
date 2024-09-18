import { useQuery } from '@tanstack/react-query';
import { PriceResponse, QuoteResponse } from '@/services/types';
import { allowance } from '@/services/allowance';

const useAllowance = (price?: PriceResponse) => {
  return useQuery({
    queryKey: [price],
    queryFn: async () => allowance(price),
    enabled: !!price,
  });
};

export default useAllowance;

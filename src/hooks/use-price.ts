import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/queries';
import { PriceRequest } from '@/services/types';
import { fetchPrice } from '@/services/fetchPrice';

const usePrice = (request?: PriceRequest) => {
  return useQuery({
    queryKey: queryKeys.price(request),
    queryFn: fetchPrice,
    enabled: !!request && request.sellAmount > 0,
  });
};

export default usePrice;

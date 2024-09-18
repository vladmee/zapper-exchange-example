import { useMutation } from '@tanstack/react-query';
import { QuoteResponse } from '@/services/types';
import { exchange } from '@/services/exchange';
import { waitForReceipt } from '@/services/wait-for-receipt';

const useExchange = (quote?: QuoteResponse) => {
  return useMutation({
    mutationFn: async () => exchange(quote),
    onSuccess: async (hash) => {
      await waitForReceipt(hash);
    },
  });
};

export default useExchange;

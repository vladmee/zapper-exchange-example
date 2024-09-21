import { useMutation } from '@tanstack/react-query';
import { PriceResponse } from '@/services/types';
import { waitForReceipt } from '@/services/wait-for-receipt';
import { approve } from '@/services/approve';

const useApprove = (price?: PriceResponse) => {
  return useMutation({
    mutationFn: async () => approve(price),
    onSuccess: async (hash) => {
      await waitForReceipt(hash);
    },
  });
};

export default useApprove;

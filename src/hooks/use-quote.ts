import { useMutation } from '@tanstack/react-query';
import { QuoteRequest, QuoteResponse } from '@/services/types';
import { fetchQuote } from '@/services/fetchQuote';

const useQuote = (request?: QuoteRequest) => {
  return useMutation({
    mutationFn: async () => fetchQuote(request),
  });
};

export default useQuote;

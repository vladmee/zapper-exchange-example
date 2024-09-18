import { PriceRequest, QuoteResponse } from '@/services/types';

export const queryKeys = {
  supportedNetworks: () => [{ endpoint: '/v2/exchange/supported' }] as const,
  balances: (address?: string) =>
    [{ endpoint: '/v2/balances/tokens', address }] as const,
  price: (request?: PriceRequest) =>
    [{ endpoint: '/v2/exchange/price', request }] as const,
};

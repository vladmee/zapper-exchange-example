import { PriceRequest } from '@/services/types';

// keeping things organized and easy to update in case the API changes
// or planning to tunnel the requests (like you should) see .env.example
export const queryKeys = {
  supportedNetworks: () => [{ endpoint: '/v2/exchange/supported' }] as const,
  balances: (address?: string) =>
    [{ endpoint: '/v2/balances/tokens', address }] as const,
  price: (request?: PriceRequest) =>
    [{ endpoint: '/v2/exchange/price', request }] as const,
};

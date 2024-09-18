import axios from 'axios';
import { Balance, BalancesResponse } from './types';
import { QueryFunctionContext } from '@tanstack/react-query';
import { queryKeys } from './queries';
import apiBaseUrl from './apiBaseUrl';
import { useStore } from '@/store';

const apiKey = process.env.NEXT_PUBLIC_ZAPPER_API_KEY;
const Authorization = `Basic ${Buffer.from(`${apiKey}:`, 'binary').toString(
  'base64'
)}`;

export async function fetchBalances({
  queryKey: [{ endpoint, address }],
}: QueryFunctionContext<ReturnType<(typeof queryKeys)['balances']>>): Promise<
  Balance[]
> {
  const network = useStore.getState().network;
  if (!network) {
    throw new Error('Network not selected.');
  }

  if (!address) {
    throw new Error('Address not defined.');
  }

  if (!apiKey) {
    throw new Error('API key is required to fetch.');
  }

  const response = await axios.get<BalancesResponse>(
    apiBaseUrl +
      endpoint +
      `?addresses%5B%5D=${address}&networks%5B%5D=${network}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization,
      },
    }
  );

  const data: Balance[] = response.data[address.toLowerCase()];
  return data;
}

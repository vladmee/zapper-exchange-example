import axios from 'axios';
import { SupportedNetworksResponse } from './types';
import { QueryFunctionContext } from '@tanstack/react-query';
import { queryKeys } from './queries';
import apiBaseUrl from './apiBaseUrl';

const apiKey = process.env.NEXT_PUBLIC_ZAPPER_API_KEY;
const Authorization = `Basic ${Buffer.from(`${apiKey}:`, 'binary').toString(
  'base64'
)}`;

export async function fetchSupportedNetworks({
  queryKey: [{ endpoint }],
}: QueryFunctionContext<
  ReturnType<(typeof queryKeys)['supportedNetworks']>
>): Promise<SupportedNetworksResponse> {
  if (!apiKey) {
    throw new Error('API key is required to fetch.');
  }

  const response = await axios.get<SupportedNetworksResponse>(
    apiBaseUrl + endpoint,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization,
      },
    }
  );

  const data: SupportedNetworksResponse = response.data;
  return data;
}

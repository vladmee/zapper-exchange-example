import axios from 'axios';
import { parseUnits } from 'viem';
import apiBaseUrl from './apiBaseUrl';
import { useStore } from '@/store';
import { QueryFunctionContext } from '@tanstack/react-query';
import { queryKeys } from './queries';
import { PriceResponse } from './types';

const apiKey = process.env.NEXT_PUBLIC_ZAPPER_API_KEY;
const Authorization = `Basic ${Buffer.from(`${apiKey}:`, 'binary').toString(
  'base64'
)}`;

// fetches the price for the selected token
// lots of validations to not call the API if the data in invalid
// if the price is not available, all other hooks like useQuote, useAllowance etc won't be called as well
export async function fetchPrice({
  queryKey: [{ endpoint, request }],
}: QueryFunctionContext<
  ReturnType<(typeof queryKeys)['price']>
>): Promise<PriceResponse> {
  const network = useStore.getState().network;
  if (!network) {
    throw new Error('Network not selected.');
  }

  if (!request) {
    throw new Error('Something went wrong.');
  }

  const token = useStore.getState().token;
  if (!token) {
    throw new Error('Token is not available in the store.');
  }

  const { buyTokenAddress, sellAmount, slippagePercentage, feeAsFraction } =
    request;

  if (typeof sellAmount !== 'number' || sellAmount <= 0) {
    throw new Error('sellAmount must be a number greater than 0.');
  }

  const { address: sellTokenAddress, decimals: decimalsString } = token;
  const decimals = Number(decimalsString);

  if (!apiKey) {
    throw new Error('API key is required to fetch.');
  }

  const sellAmountInWei = parseUnits(
    sellAmount.toString(),
    decimals
  ).toString();

  const url =
    apiBaseUrl +
    endpoint +
    `?sellTokenAddress=${sellTokenAddress}&buyTokenAddress=${buyTokenAddress}&sellAmount=${sellAmountInWei}&slippagePercentage=${slippagePercentage}&network=${network}&feeAsFraction=${feeAsFraction}`;

  try {
    const response = await axios.get<PriceResponse>(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization,
      },
    });

    const data: PriceResponse = response.data;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message ||
          'An error occurred while fetching the prices.'
      );
    }
    throw new Error('An error occurred while fetching the prices.');
  }
}

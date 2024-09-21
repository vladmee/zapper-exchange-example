import axios from 'axios';
import apiBaseUrl from './apiBaseUrl';
import { QuoteRequest, QuoteResponse } from './types';
import { useStore } from '@/store';

const endpoint = '/v2/exchange/quote';

const apiKey = process.env.NEXT_PUBLIC_ZAPPER_API_KEY;
const Authorization = `Basic ${Buffer.from(`${apiKey}:`, 'binary').toString(
  'base64'
)}`;

// fetches a quote for the exchange transaction
export async function fetchQuote(
  request?: QuoteRequest
): Promise<QuoteResponse> {
  if (!request) {
    throw new Error('Something went wrong.');
  }

  // most of these values are passed directly from price
  const {
    sellTokenAddress,
    buyTokenAddress,
    sellAmount,
    ownerAddress,
    slippagePercentage,
    network,
    feeAsFraction,
  } = request;

  if (
    !sellTokenAddress ||
    !buyTokenAddress ||
    !sellAmount ||
    !ownerAddress ||
    !slippagePercentage ||
    !network ||
    feeAsFraction === undefined
  ) {
    throw new Error('All request parameters must be provided.');
  }

  if (!apiKey) {
    throw new Error('API key is required to fetch.');
  }

  const url =
    apiBaseUrl +
    endpoint +
    `?sellTokenAddress=${sellTokenAddress}&buyTokenAddress=${buyTokenAddress}&sellAmount=${sellAmount}&ownerAddress=${ownerAddress}&slippagePercentage=${slippagePercentage}&network=${network}&feeAsFraction=${feeAsFraction}`;

  try {
    const response = await axios.get<QuoteResponse>(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization,
      },
    });

    const data: QuoteResponse = response.data;

    useStore.getState().setQuote(data);

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

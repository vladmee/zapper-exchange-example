import { useStore } from '@/store';
import { QuoteResponse } from './types';
import { connectWalletClient } from '@/client';
import {
  Address,
  isAddress,
  SendTransactionReturnType,
  WalletClient,
} from 'viem';
import { z } from 'zod';

// zod validation to make sure the quote data is formatted correctly before sending the transaction
const requestSchema = z
  .object({
    to: z
      .string()
      .refine(isAddress)
      .transform((data) => data as Address),
    value: z.string().transform(BigInt),
    data: z.string().transform((data) => data as Address),
    gas: z.string().transform(BigInt),
    maxPriorityFeePerGas: z.string().transform(BigInt),
    maxFeePerGas: z.string().transform(BigInt),
  })
  .transform(({ gas, ...rest }) => ({
    gasLimit: gas,
    ...rest,
  }));

// it triggers the exchange transaction based on a valid quote
export async function exchange(
  quote?: QuoteResponse
): Promise<SendTransactionReturnType> {
  if (!quote) {
    throw new Error("Quote doesn't exist.");
  }

  const network = useStore.getState().network;
  if (!network) {
    throw new Error('Network not selected.');
  }

  try {
    const walletClient: WalletClient = await connectWalletClient(network);

    if (typeof walletClient.sendTransaction !== 'function') {
      throw new Error('walletClient does not have a sendTransaction method.');
    }
    const [account] = await walletClient.requestAddresses();

    const request = requestSchema.parse(quote);

    return walletClient.sendTransaction({
      account,
      to: request.to,
      value: request.value,
      data: request.data,
      maxPriorityFeePerGas: request.maxPriorityFeePerGas,
      maxFeePerGas: request.maxFeePerGas,
      gasLimit: request.gasLimit,
      chain: walletClient.chain,
    } as const);
  } catch (error) {
    throw new Error(`Failed to exchange: ${error}`);
  }
}

import { useStore } from '@/store';
import { QuoteResponse } from './types';
import { connectWalletClient } from '@/client';
import { Address, isAddress, SendTransactionReturnType } from 'viem';
import { z } from 'zod';

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
    const walletClient = await connectWalletClient(network);
    const [account] = await walletClient.requestAddresses();

    const request = requestSchema.parse(quote);

    return walletClient.sendTransaction({ ...request, account });
  } catch (error) {
    throw new Error(`Failed to exchange: ${error}`);
  }
}

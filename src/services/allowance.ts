import { useStore } from '@/store';
import { PriceResponse, QuoteResponse } from './types';
import { connectPublicClient } from '@/client';
import { Address, erc20Abi, formatUnits } from 'viem';

export async function allowance(price?: PriceResponse) {
  if (!price) {
    throw new Error("Quote doesn't exist.");
  }

  const network = useStore.getState().network;
  if (!network) {
    throw new Error('Network not selected.');
  }

  const wallet = useStore.getState().wallet;
  if (!wallet) {
    throw new Error('Wallet not set.');
  }

  const { allowanceTarget, sellTokenAddress, sellAmount } = price;

  try {
    const publicClient = await connectPublicClient(network);

    const args = [wallet as Address, allowanceTarget as Address] as const;

    const [allowance, decimals] = await publicClient.multicall({
      contracts: [
        {
          abi: erc20Abi,
          address: sellTokenAddress as Address,
          functionName: 'allowance',
          args,
        },
        {
          abi: erc20Abi,
          address: sellTokenAddress as Address,
          functionName: 'decimals',
          args: [],
        },
      ],
    });

    if (allowance.status !== 'success' || decimals.status !== 'success') {
      throw new Error('Failed to retrieve allowance or decimals.');
    }

    const displayAllowance = formatUnits(allowance.result, decimals.result);

    return {
      allowance: displayAllowance,
      isApproved: allowance.result >= BigInt(sellAmount),
    };
  } catch (error) {
    throw new Error(`Failed to approve: ${error}`);
  }
}

import { useStore } from '@/store';
import { PriceResponse } from './types';
import { connectPublicClient } from '@/client';
import { Address, erc20Abi, formatUnits } from 'viem';

// it fetches the exact allowance and checks if the allowance is enough to sell the desired amount
// @returns both the allowance and a boolean indicating if the allowance is enough
export async function allowance(price?: PriceResponse) {
  if (!price) {
    throw new Error("Price doesn't exist.");
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
    const publicClient = connectPublicClient(network);

    const args = [wallet as Address, allowanceTarget as Address] as const;

    // tried to do a multicall but it didn't work with anvil.
    // or I couldn't make it work. TODO: check this later
    // const [allowance, decimals] = await publicClient.multicall({
    //   contracts: [
    //     {
    //       abi: erc20Abi,
    //       address: sellTokenAddress as Address,
    //       functionName: 'allowance',
    //       args,
    //     },
    //     {
    //       abi: erc20Abi,
    //       address: sellTokenAddress as Address,
    //       functionName: 'decimals',
    //       args: [],
    //     },
    //   ],
    // });

    const [allowance, decimals] = await Promise.all([
      publicClient.readContract({
        abi: erc20Abi,
        address: sellTokenAddress as Address,
        functionName: 'allowance',
        args,
      }),
      publicClient.readContract({
        abi: erc20Abi,
        address: sellTokenAddress as Address,
        functionName: 'decimals',
        args: [],
      }),
    ]);

    const displayAllowance = formatUnits(allowance, decimals);

    return {
      allowance: displayAllowance,
      isApproved: allowance >= BigInt(sellAmount),
    };
  } catch (error) {
    throw new Error(`Failed to approve: ${error}`);
  }
}

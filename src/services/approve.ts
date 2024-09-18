import { useStore } from '@/store';
import { PriceResponse } from './types';
import { connectWalletClient } from '@/client';
import { Address, erc20Abi, WriteContractReturnType } from 'viem';

export async function approve(
  price?: PriceResponse
): Promise<WriteContractReturnType> {
  if (!price) {
    throw new Error("Quote doesn't exist.");
  }

  const network = useStore.getState().network;
  if (!network) {
    throw new Error('Network not selected.');
  }

  const { allowanceTarget, sellTokenAddress, sellAmount } = price;

  try {
    const walletClient = await connectWalletClient(network);
    const [account] = await walletClient.requestAddresses();

    const args = [allowanceTarget as Address, BigInt(sellAmount)] as const;

    return walletClient.writeContract({
      abi: erc20Abi,
      address: sellTokenAddress as Address,
      functionName: 'approve',
      args,
      account,
    });
  } catch (error) {
    throw new Error(`Failed to approve: ${error}`);
  }
}

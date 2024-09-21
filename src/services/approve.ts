import { useStore } from '@/store';
import { PriceResponse } from './types';
import { connectWalletClient } from '@/client';
import { Address, erc20Abi, WriteContractReturnType } from 'viem';

// it triggers the approval transaction for the token to sell
// getting the price response assures approval of the right contracts
export async function approve(
  price?: PriceResponse
): Promise<WriteContractReturnType> {
  if (!price) {
    throw new Error("Price doesn't exist.");
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
      chain: walletClient.chain,
      account,
    });
  } catch (error) {
    throw new Error(`Failed to approve: ${error}`);
  }
}

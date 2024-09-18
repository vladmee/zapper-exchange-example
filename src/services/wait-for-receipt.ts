import { connectPublicClient } from '@/client';
import { useStore } from '@/store';
import { Address } from 'viem';

export async function waitForReceipt(hash: Address) {
  const network = useStore.getState().network;
  if (!network) {
    throw new Error('Network not selected.');
  }

  try {
    const publicClient = connectPublicClient(network);

    return publicClient.waitForTransactionReceipt({ hash });
  } catch (error) {
    throw new Error(`Failed to wait for the transaction receipt: ${error}`);
  }
}

'use client';

import { createWalletClient, createPublicClient, custom, http } from 'viem';
import * as viemChains from 'viem/chains';
import 'viem/window';

export async function connectWalletClient(network: string) {
  let transport;
  if (window.ethereum) {
    transport = custom(window.ethereum);
  } else {
    const errorMessage =
      "Can't detect MetaMask or an injected wallet. Please install one to proceed.";
    throw new Error(errorMessage);
  }

  const chainKey = network;
  let supportedChain;

  for (const [key, chain] of Object.entries(viemChains)) {
    if (typeof chain !== 'object') continue;
    if (!('name' in chain)) continue;
    if ((chainKey === 'ethereum' && key === 'mainnet') || key === chainKey) {
      supportedChain = { ...chain, network: key };
      break;
    }
  }

  if (!supportedChain) {
    throw new Error(`Chain with key ${chainKey} not found.`);
  }

  const walletClient = createWalletClient({
    chain: supportedChain,
    transport: transport,
  });

  return walletClient;
}

export function connectPublicClient(network: string) {
  const chainKey = network;
  let supportedChain;

  for (const [key, chain] of Object.entries(viemChains)) {
    if (typeof chain !== 'object') continue;
    if (!('name' in chain)) continue;
    if ((chainKey === 'ethereum' && key === 'mainnet') || key === chainKey) {
      supportedChain = { ...chain, network: key };
      break;
    }
  }

  if (!supportedChain) {
    throw new Error(`Chain with key ${chainKey} not found.`);
  }

  const publicClient = createPublicClient({
    chain: supportedChain,
    transport: http(),
  });

  return publicClient;
}

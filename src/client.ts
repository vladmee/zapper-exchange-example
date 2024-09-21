'use client';

import {
  createWalletClient,
  createPublicClient,
  custom,
  http,
  createTestClient,
  walletActions,
  publicActions,
  WalletClient,
} from 'viem';
import * as viemChains from 'viem/chains';
import 'viem/window';
import { useStore } from './store';

// viem wallet clients are created here

// wallet client; injected wallets only
export async function connectWalletClient(
  network: string
): Promise<WalletClient> {
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

  // filter the supported chains based on the results from v2/exchange/supported
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

  // if anvil is enabled; a test client will be returned instead
  const isLocalDev = useStore.getState().isLocalDev;
  if (isLocalDev) {
    const testClient = createTestClient({
      chain: viemChains.foundry, // anvil; 31337 chain id
      mode: 'anvil',
      transport,
    })
      .extend(publicActions)
      .extend(walletActions);
    return testClient as WalletClient;
  }

  const walletClient = createWalletClient({
    chain: supportedChain,
    transport,
  });

  return walletClient as WalletClient;
}

// public client for reading blockchain data
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

  const isLocalDev = useStore.getState().isLocalDev;
  if (isLocalDev) {
    const testClient = createTestClient({
      chain: viemChains.foundry, // anvil; 31337 chain id
      mode: 'anvil',
      transport: http(),
    }).extend(publicActions);
    return testClient;
  }

  const publicClient = createPublicClient({
    chain: supportedChain,
    transport: http(), // public rpc
  });

  return publicClient;
}

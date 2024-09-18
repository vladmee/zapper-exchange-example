import { create } from 'zustand';
import { Token } from './services/types';

interface StoreState {
  network?: string;
  wallet?: string;
  token?: Token;
  setWallet: (wallet: string) => void;
  setSelectedToken: (token?: Token) => void;
  setNetwork: (network: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  network: 'ethereum',
  wallet: '',
  token: undefined,
  setWallet: (wallet: string) => set({ wallet }),
  setSelectedToken: (token?: Token) => set({ token }),
  setNetwork: (network: string) => set({ network }),
}));

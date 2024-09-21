import { create } from 'zustand';
import { QuoteResponse, Token } from './services/types';

interface StoreState {
  isLocalDev: boolean;
  network?: string;
  wallet?: string;
  isConnectedWallet: boolean;
  token?: Token;
  quote: string;
  setWallet: (wallet: string) => void;
  setSelectedToken: (token?: Token) => void;
  setNetwork: (network: string) => void;
  setQuote: (quote: QuoteResponse) => void;
  setIsLocalDev: (isLocalDev: boolean) => void;
  setIsConnectedWallet: (isConnected: boolean) => void;
}

// zustand store. mainly used for the user selections
export const useStore = create<StoreState>((set) => ({
  isLocalDev: false,
  network: 'ethereum',
  wallet: '',
  isConnectedWallet: false,
  token: undefined,
  quote: '',
  setWallet: (wallet: string) => set({ wallet }),
  setSelectedToken: (token?: Token) => set({ token }),
  setNetwork: (network: string) => set({ network }),
  setQuote: (quote: QuoteResponse) =>
    set((state) => ({
      quote: `cast send --from ${state.wallet} --unlocked ${quote.to} --value ${quote.value} --gas-limit ${quote.estimatedGas} --gas-price ${quote.gasPrice} --priority-gas-price ${quote.maxPriorityFeePerGas} ${quote.data}`,
    })),
  setIsLocalDev: (isLocalDev: boolean) => set({ isLocalDev }),
  setIsConnectedWallet: (isConnected: boolean) =>
    set({ isConnectedWallet: isConnected }),
}));

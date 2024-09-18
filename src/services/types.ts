export interface Network {
  network: string;
  label: string;
}

export interface SupportedNetworksResponse extends Array<Network> {}

export interface Balance {
  key: string;
  address: string;
  network: string;
  updatedAt: string;
  token: Token;
}

export interface Token {
  address: string;
  network: string;
  label: string;
  name: string;
  symbol: string;
  decimals: string;
  verified: boolean;
  price: string;
  balance: number;
  balanceUSD: number;
  balanceRaw: string;
}

export interface BalancesResponse {
  [address: string]: Balance[];
}

export interface PriceRequest {
  sellTokenAddress?: string;
  buyTokenAddress?: string;
  sellAmount: number;
  slippagePercentage: number;
  feeAsFraction: number;
}

export interface QuoteRequest {
  sellTokenAddress?: string;
  buyTokenAddress?: string;
  sellAmount?: string;
  ownerAddress?: string;
  slippagePercentage?: number;
  network?: string;
  feeAsFraction?: number;
}

export interface PriceResponse {
  price: string;
  value: string;
  gas: string;
  estimatedGas: string;
  gasPrice: string;
  maxPriorityFeePerGas: string;
  maxFeePerGas: string;
  buyTokenAddress: string;
  sellTokenAddress: string;
  buyAmount: string;
  sellAmount: string;
  allowanceTarget: string;
  sources: Source[];
  zapperFee: number;
}

export interface QuoteResponse {
  price: string;
  data: string;
  to: string;
  value: string;
  estimatedGas: string;
  gasPrice: string;
  maxPriorityFeePerGas: string;
  maxFeePerGas: string;
  buyTokenAddress: string;
  sellTokenAddress: string;
  buyAmount: string;
  sellAmount: string;
  allowanceTarget: string;
  sources: Source[];
  zapperFee: number;
}

export interface Source {
  name: string;
  proportion: number;
  displayName: string;
  symbol: string;
  hops: unknown[];
}

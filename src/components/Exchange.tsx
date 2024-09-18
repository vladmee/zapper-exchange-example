"use client";

import { useStore } from "../store";
import React, { useEffect, useState } from "react";
import usePrice from "@/hooks/use-price";
import useExchange from "@/hooks/use-exchange";
import { useDebounce } from "@/hooks/use-debounce";
import useQuote from "@/hooks/use-quote";
import useToken from "@/hooks/use-token";
import Approve from "./Approve";

export interface Source {
  name: string;
  proportion: number;
  displayName: string;
  symbol: string;
  hops: unknown[];
}

const buyTokenAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

const Exchange = () => {
  const { wallet, token, network, setSelectedToken } = useStore();

  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const debouncedAmount = useDebounce(amount, 300);

  const { data: price, error: priceError } = usePrice({
    sellTokenAddress: token?.address,
    buyTokenAddress,
    sellAmount: debouncedAmount,
    slippagePercentage: 0.02,
    feeAsFraction: 0
  })
  const { buyAmount } = useToken({
    network,
    decimals: 6,
    amount: price?.buyAmount
  });
  const { data: quote, mutateAsync: getQuote, reset: resetQuote } = useQuote({
    sellTokenAddress: price?.sellTokenAddress,
    buyTokenAddress: price?.buyTokenAddress,
    sellAmount: price?.sellAmount,
    ownerAddress: wallet,
    slippagePercentage: 0.02,
    network,
    feeAsFraction: 0
  });
  const { error: exchangeError, mutate: exchange, isPending: isPendingExchange } = useExchange(quote);

  useEffect(() => {
    resetQuote();
  }, [amount]);

  if (!token) return;

  return (
    <div className="pt-8">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded"
        onClick={() => setSelectedToken(undefined)}
      >
        Back
      </button>
      <div className="mb-4">
        <span className="font-bold">{token.symbol}</span>: {token.balance}
      </div>
      <div className="mb-4">
        <input
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Amount to swap"
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (value > token.balance) {
              setError("Amount exceeds balance");
            } else {
              setError("");
            }
            setAmount(value);
          }}
        />
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
      <div className="flex items-center mb-4">
        {buyAmount && (
          <div className="mr-4">
            <span className="font-bold">Buy Amount:</span> {buyAmount} USDC
          </div>
        )}
        <Approve price={price} />
      </div>
      {!quote ? (
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={!price}
          onClick={() => getQuote()}
        >
          Review
        </button>) : (
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => exchange()}
          disabled={isPendingExchange}
        >
          {isPendingExchange ? "Processing..." : "Exchange"}
        </button>
      )
      }
      <div className="mt-4">
        {price?.sources.map((source, index) => (
          <div key={index} className="mb-2">
            <span className="font-bold">{source.displayName}</span>: {source.proportion * 100}%
          </div>
        ))}
      </div>
      {
        (error || exchangeError || priceError) && (
          <div className="mt-4 text-red-500">
            {error}
            {exchangeError?.message}
            {priceError?.message}
          </div>
        )
      }
      {
        quote && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="font-bold mb-2">Transaction Details</h3>
            <pre className="whitespace-pre-wrap overflow-auto bg-gray-100 p-2 rounded">
              <code>{JSON.stringify(quote, null, 2)}</code>
            </pre>
          </div>
        )
      }
    </div >
  );
};

export default Exchange;

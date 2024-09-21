"use client";

import { useStore } from "../store";
import React, { useEffect, useState } from "react";
import usePrice from "@/hooks/use-price";
import useExchange from "@/hooks/use-exchange";
import { useDebounce } from "@/hooks/use-debounce";
import useQuote from "@/hooks/use-quote";
import useToken from "@/hooks/use-token";
import Approve from "./Approve";
import useUsdc from "@/hooks/use-usdc";

export interface Source {
  name: string;
  proportion: number;
  displayName: string;
  symbol: string;
  hops: unknown[];
}

// Main exchange component. This is where the magic happens 🪄✨
const Exchange = () => {
  const { wallet, token, network, setSelectedToken } = useStore(); // zustand store

  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const debouncedAmount = useDebounce(amount, 300);

  const { address: usdcAddress, decimals: usdcDecimals } = useUsdc(network); // The buy token address is hardcoded to USDC for this example

  // usePrice calls /v2/exchange/price
  const { data: price, error: priceError } = usePrice({
    sellTokenAddress: token?.address,
    buyTokenAddress: usdcAddress,
    sellAmount: debouncedAmount,
    slippagePercentage: 0.02,
    feeAsFraction: 0
  })

  // useQuote calls /v2/exchange/quote
  const { data: quote, mutate: getQuote, isPending: isPendingQuote, reset: resetQuote } = useQuote({
    sellTokenAddress: price?.sellTokenAddress,
    buyTokenAddress: price?.buyTokenAddress,
    sellAmount: price?.sellAmount,
    ownerAddress: wallet,
    slippagePercentage: 0.2,
    network,
    feeAsFraction: 0
  });

  // useExchange triggers the exchange transaction based on a valid quote
  const { mutate: exchange, isPending: isPendingExchange, error: exchangeError } = useExchange(quote);

  // useToken just formats the amount to display
  const { buyAmount } = useToken({
    decimals: usdcDecimals,
    amount: price?.buyAmount
  });

  useEffect(() => {
    resetQuote(); // reset the quote when the amount changes
  }, [amount, resetQuote]);

  if (!token) return;

  // everything in one component... gg!
  return (
    <div>
      <button
        className="mb-4 flex items-center px-4 py-2 bg-gray-200 rounded"
        onClick={() => setSelectedToken(undefined)}
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
        <span className="italic">Back</span>
      </button>
      <div className="p-4 border rounded shadow-md bg-white mb-4">
        <div className="mb-4">
          <span className="font-bold">{token.symbol}</span>: {token.balance}
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="number"
            className="w-full p-2 border rounded mr-4"
            placeholder="Amount to exchange"
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
          <Approve price={price} />
        </div>
        {error && <div className="text-red-500 my-2">{error}</div>}
        <div className="flex items-center mb-4">
          <div className="mr-4">
            <span className="font-bold">USDC to receive:</span> {buyAmount && <>{buyAmount}</>}
          </div>
        </div>
      </div>
      {price && (
        <div className="flex flex-row gap-x-2 mt-4">
          Exchange route:
          {price.sources.map((source, index) => (
            <div key={index} className="mb-2">
              <span className="font-bold">{source.displayName}</span>: {source.proportion * 100}%
            </div>
          ))}
        </div>
      )}
      {!quote ? (
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={!price || isPendingQuote}
          onClick={() => getQuote()}
        >
          {isPendingQuote ? "Obtaining quote..." : "Review"}
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

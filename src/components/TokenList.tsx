"use client";

import { useStore } from "../store";
import React, { useEffect } from "react";
import useBalances from "../hooks/use-balances";
import Exchange from "./Exchange";

const TokenList = () => {
  const { wallet, setSelectedToken, token } = useStore();
  const { data: balances, isLoading, error } = useBalances(wallet);

  useEffect(() => {
    setSelectedToken(undefined);
  }, [wallet]);

  if (token) return <Exchange />;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading balances</div>;
  if (!balances) return null;

  const verifiedBalances = balances.filter(balance => balance.token.verified);

  return (
    <div className="pt-10 space-y-4">
      {balances.map((balance) => (
        <div
          key={balance.key}
          className="flex justify-between items-center p-4 bg-white shadow rounded-lg hover:bg-gray-100 cursor-pointer"
          onClick={() => setSelectedToken(balance.token)}
        >
          <p className="font-semibold text-gray-700">{balance.token.symbol}</p>
          <p className="text-gray-500">{balance.token.balance}</p>
        </div>
      ))}
    </div>
  );
};

export default TokenList;

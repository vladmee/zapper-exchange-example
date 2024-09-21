"use client";

import { useStore } from "../store";
import React, { useEffect, useState } from "react";
import useBalances from "../hooks/use-balances";
import Exchange from "./Exchange";

// Displays the tokens available in the wallet and their balances
const TokenList = () => {
  const { wallet, setSelectedToken, token } = useStore();
  // Data retrieved from v2/balances/tokens using a GET request!
  // be aware that it will retrieve cached data
  //TODO: do a POST request if the retrieved data is outdated
  const { data: balances, isLoading, error } = useBalances(wallet);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(true);

  useEffect(() => {
    setSelectedToken(undefined);
  }, [setSelectedToken, wallet]);

  if (token) return <Exchange />; // if a token from the list below is selected, display the exchange component instead

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error loading tokens: {error.message}</div>;
  if (!balances) return <div>No tokens found in this wallet. Try another address</div>;

  const verifiedBalances = balances.filter(balance => balance.token.verified); // using the verified field from Zapper to filter the tokens
  const displayedBalances = showVerifiedOnly ? verifiedBalances : balances;
  //TODO: maybe filter out the tokens that have no USD worth as well

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="verified-only"
          checked={showVerifiedOnly}
          onChange={() => setShowVerifiedOnly(!showVerifiedOnly)}
          className="mr-2"
        />
        <label htmlFor="verified-only" className="text-gray-700">verified tokens only</label>
      </div>
      {displayedBalances.map((balance) => (
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

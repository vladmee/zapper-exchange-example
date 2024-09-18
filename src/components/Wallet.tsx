"use client";

import { useState } from "react";
import { connectWalletClient } from "@/client";
import { useStore } from "@/store";

const Wallet = () => {
  const { wallet, network, setWallet } = useStore();
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWallet(e.target.value);
  };

  const handleConnectWallet = async () => {
    if (!network) {
      console.error("Network not selected.");
      return;
    }

    try {
      const walletClient = await connectWalletClient(network);
      const [connectedAddress] = await walletClient.requestAddresses();
      setWallet(connectedAddress);
      setIsWalletConnected(true);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnectWallet = () => {
    setWallet("");
    setIsWalletConnected(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={wallet}
        onChange={handleChange}
        placeholder="Enter address"
        className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isWalletConnected}
      />
      {!isWalletConnected ? (
        <button
          onClick={handleConnectWallet}
          className="p-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
        >
          Connect Wallet
        </button>
      ) : (
        <button
          onClick={handleDisconnectWallet}
          className="p-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 w-32"
        >
          Disconnect
        </button>
      )}
    </div>
  );
};

export default Wallet;

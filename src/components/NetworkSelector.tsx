'use client';

import React from 'react';
import useSupportedNetworks from '@/hooks/use-supported-networks';
import { useStore } from '@/store';

// Select the network where you want to exchange
const NetworkSelector = () => {
  // Supported networks are retrieved from v2/exchange/supported
  const { data: networks } = useSupportedNetworks();
  const { network, setNetwork, isLocalDev, setIsLocalDev } = useStore();

  if (!networks) return null;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNetwork(event.target.value);
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLocalDev(event.target.checked);
  };

  return (
    <div className="flex items-center mb-8 w-full justify-between">
      <select
        id="network-selector"
        value={isLocalDev ? 'foundry' : network}
        onChange={handleChange}
        disabled={isLocalDev}
        className="mt-1 block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {isLocalDev ? (
          <option value="foundry">anvil</option>
        ) : (
          networks.map((network) => (
            <option key={network.network} value={network.network}>
              {network.label}
            </option>
          ))
        )}
      </select>
      {/* a switch to toggle to anvil; this will create a test client using viem (used to interact with your local anvil fork); it will also display the instructions component with the anvil commands */}
      <label className="ml-4 flex items-center">
        <span className="mr-2">use anvil</span>
        <input
          type="checkbox"
          checked={isLocalDev}
          onChange={handleSwitchChange}
          className="form-checkbox h-5 w-5 text-indigo-600"
        />
      </label>
    </div>
  );
};

export default NetworkSelector;
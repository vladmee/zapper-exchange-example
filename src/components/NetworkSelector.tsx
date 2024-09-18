'use client';

import React from 'react';
import useSupportedNetworks from '@/hooks/use-supported-networks';
import { useStore } from '@/store';

const NetworkSelector = () => {
  const { data: networks } = useSupportedNetworks();
  const { network, setNetwork } = useStore();

  if (!networks) return null;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNetwork(event.target.value);
  };

  return (
    <select
      id="network-selector"
      value={network}
      onChange={handleChange}
      className="mt-1 block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md mb-8"
    >
      {networks.map((network) => (
        <option key={network.network} value={network.network}>
          {network.label}
        </option>
      ))}
    </select>
  );
};

export default NetworkSelector;
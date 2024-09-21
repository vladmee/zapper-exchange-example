const useUsdc = (network?: string) => {
  if (!network) {
    throw new Error('Network not selected.');
  }

  let address;

  switch (network) {
    case 'ethereum':
      address = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
      break;
    case 'polygon':
      address = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359';
      break;
    case 'celo':
      address = '0xcebA9300f2b948710d2653dD7B07f33A8B32118C';
      break;
    case 'binance-smart-chain':
      address = '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d';
      break;
    case 'arbitrum':
      address = '0xaf88d065e77c8cc2239327c5edb3a432268e5831';
      break;
    case 'base':
      address = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
      break;
    case 'fantom':
      address = '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75';
      break;
    case 'avalanche':
      address = '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E';
      break;
    case 'optimism':
      address = '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85';
      break;
    default:
      throw new Error('Network not supported');
  }

  return { address, decimals: 6 };
};

export default useUsdc;

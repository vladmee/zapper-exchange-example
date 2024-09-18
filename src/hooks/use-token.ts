import { formatUnits } from 'viem';

const useToken = ({
  network,
  decimals,
  amount,
}: {
  network?: string;
  decimals?: number;
  amount?: string;
}) => {
  if (!network || !decimals || !amount)
    return {
      buyAmount: undefined,
    };

  const displayAmount = formatUnits(BigInt(amount), decimals);

  return {
    buyAmount: displayAmount,
  };
};

export default useToken;

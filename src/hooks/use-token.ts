import { formatUnits } from 'viem';

// formats a token
const useToken = ({
  decimals,
  amount,
}: {
  decimals?: number;
  amount?: string;
}) => {
  if (!decimals || !amount)
    return {
      buyAmount: undefined,
    };

  const displayAmount = formatUnits(BigInt(amount), decimals);

  return {
    buyAmount: displayAmount,
  };
};

export default useToken;

import useAllowance from '@/hooks/use-allowance';
import useApprove from '@/hooks/use-approve';
import { PriceResponse, QuoteResponse } from '@/services/types';
import React from 'react';

interface ApproveProps {
  price?: PriceResponse
}

const Approve: React.FC<ApproveProps> = ({ price }) => {
  const { data } = useAllowance(price);
  const { mutate: approve, isPending } = useApprove(price);

  if (!price || !data) return null;

  const { allowance, isApproved } = data

  if (isApproved) {
    const displayAllowance = allowance.length > 10 ? `${allowance.substring(0, 10)}...` : allowance;
    return (
      <div className="flex justify-center items-center">
        <button className="bg-gray-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed" disabled>
          Allowance: {displayAllowance}
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <button
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => approve()}
        disabled={isPending}
      >
        {isPending ? "Approving..." : "Approve"}
      </button>
    </div>
  );
};

export default Approve;
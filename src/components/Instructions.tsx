'use client';

import { useStore } from '@/store';
import React from 'react';
import CodeSnippet from './CodeSnippet';

// Pure utility. This component displays the bash commands for interacting with anvil.
const Instructions: React.FC = () => {
  const { isLocalDev, wallet, quote, token } = useStore();

  if (!isLocalDev || !wallet) return null;

  return (
    <div className="w-full sm:w-[620px] p-4 bg-gray-100 rounded-md">
      <CodeSnippet label="Impersonate account" copyText={`cast rpc anvil_impersonateAccount ${wallet}`}>
        cast rpc anvil_impersonateAccount {wallet}
      </CodeSnippet>
      <CodeSnippet label="Check USDC balance" copyText={`cast call 0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48 "balanceOf(address)(uint256)" ${wallet}`}>
        cast call 0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48 &quot;balanceOf(address)(uint256)&quot; {wallet}
      </CodeSnippet>
      {token && token.address !== "0x0000000000000000000000000000000000000000" && (
        <>
          <CodeSnippet label="Check selected token balance" copyText={`cast call ${token.address} "balanceOf(address)(uint256)" ${wallet}`}>
            cast call {token.address} &quot;balanceOf(address)(uint256)&quot; {wallet}
          </CodeSnippet>
          {/* this part was supposed to display the command for approving a token but it's pretty useless: if the amount is not approved on mainnet the API will fail to return a quote anyway */}
          {/* <CodeSnippet label="Approve max spending" copyText={`cast send ${token.address} "approve(address,uint256)" 0xDef1C0ded9bec7F1a1670819833240f027b25EfF 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff --from ${wallet} --unlocked`}>
            cast send {token.address} &quot;approve(address,uint256)&quot; 0xDef1C0ded9bec7F1a1670819833240f027b25EfF 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff --from {wallet} --unlocked
          </CodeSnippet> */}
        </>
      )}
      {token?.address === "0x0000000000000000000000000000000000000000" && (
        <CodeSnippet label="Check ETH balance" copyText={`cast balance ${wallet} --ether`}>
          cast balance {wallet} --ether
        </CodeSnippet>
      )}
      {quote && (
        <CodeSnippet label="Send exchange transaction" copyText={quote}>
          {quote.length > 250 ? `${quote.substring(0, 250)}...` : quote}
        </CodeSnippet>
      )}
    </div>
  );
};

export default Instructions;

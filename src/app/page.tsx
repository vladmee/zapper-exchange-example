import Wallet from "@/components/Wallet";
import TokenList from "@/components/TokenList";
import NetworkSelector from "@/components/NetworkSelector";
import Instructions from "@/components/Instructions";


export default function Home() {
  return (
    <div className="w-full pt-40 flex justify-center">
      <div className='flex flex-row space-x-10'>
        <div className="w-full sm:w-[620px]">
          <NetworkSelector />
          <Wallet />
          <div className="pt-8">
            <TokenList />
          </div>
        </div>
        <Instructions />
      </div>
    </div>
  );
}
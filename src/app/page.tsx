import Wallet from "@/components/Wallet";
import TokenList from "@/components/TokenList";
import NetworkSelector from "@/components/NetworkSelector";

export default function Home() {
  return (
    <div className="flex justify-center h-screen w-full sm:w-auto pt-40">
      <div className="w-full sm:w-[620px]">
        <NetworkSelector />
        <Wallet />
        <TokenList />
      </div>
    </div>
  );
}

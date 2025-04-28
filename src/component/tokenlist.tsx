import BalanceCard from './pulgin/balancecard';
import TokenCardTable from './pulgin/tokentable';
import SolanaTokenMetadata from './solanatokenmetadata/page';

function Tradetoken() {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex items-center gap-3 mb-10">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              PumpFun Token Trader
            </h1>
            <p className="text-sm text-purple-300/70 mt-1">
              Trade the latest Pump.fun tokens instantly
            </p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="mb-8">
          <BalanceCard />
        </div>

        {/* Solana Token Metadata */}
        <div className="mb-8">
          <SolanaTokenMetadata />
        </div>

        {/* Token Table */}
        <div>
          <TokenCardTable />
        </div>

      </div>
    </div>
  );
}

export default Tradetoken;

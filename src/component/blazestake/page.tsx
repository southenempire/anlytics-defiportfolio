import { useEffect, useState } from 'react';
import { getTargetStakes } from '../web3plugin/blazestake';
import { useWallet } from '@solana/wallet-adapter-react';

interface BlazeStakeData {
  status: 'success' | 'error';
  stakes?: Record<string, number>;
  error?: string;
}

export default function BlazeStakeCard() {
  const { publicKey } = useWallet();
  const [stakeData, setStakeData] = useState<BlazeStakeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStakeData = async () => {
      if (!publicKey) {
        setLoading(false);
        return;
      }

      try {
        const result = await getTargetStakes(publicKey.toString());
        setStakeData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stake data');
      } finally {
        setLoading(false);
      }
    };

    fetchStakeData();
  }, [publicKey]);

  const totalStake = stakeData?.status === 'success' && stakeData.stakes
    ? Object.values(stakeData.stakes).reduce((sum, amount) => sum + amount, 0)
    : 0;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg mt-6">
      <div className="flex items-center gap-4 mb-6 p-2">
        <div className="w-12 h-12 relative">
          <img
            src="https://stake.solblaze.org/assets/blze.png"
            alt="Blaze Stake"
            width={50}
            height={50}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">Blaze Stake</h2>
          <span className="text-xs bg-blue-600 text-gray-100 mt-1 px-2 py-0.5 rounded-full w-fit">Staking</span>
        </div>
      </div>

      {!publicKey ? (
        <div className="text-center py-4 text-sm text-gray-400">
          Connect your wallet to view Blaze Stake data
        </div>
      ) : loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-1/6 animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4">
          <p className="text-gray-300 text-sm">{error}</p>
        </div>
      ) : stakeData?.status === 'success' && stakeData.stakes ? (
        <div className="space-y-4">
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Total Target Stake</div>
            <div className="text-2xl font-bold text-purple-300">
              {totalStake.toFixed(4)} SOL
            </div>
          </div>
          
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs text-gray-300 font-medium">Validator</th>
                    <th className="px-4 py-2 text-right text-xs text-gray-300 font-medium">Target Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {Object.entries(stakeData.stakes).map(([validator, amount]) => (
                    <tr key={validator} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-4 py-2 text-sm font-mono text-gray-300">
                        {validator.slice(0, 6)}...{validator.slice(-4)}
                      </td>
                      <td className="px-4 py-2 text-right text-sm text-gray-300">
                        {amount.toFixed(4)} SOL
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-sm text-gray-400">
          No target stakes found
        </div>
      )}
    </div>
  );
}

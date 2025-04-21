import { useEffect, useState } from 'react';
import { DollarSign, PieChart, Image, Fuel } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { getSolBalance, getSolPriceInUSD, getTokenAccounts, getStakeAccounts } from '../web3plugin/portfolio';

interface BalanceCardProps {
  address?: string;  // Make address optional
}

const BalanceCard = ({  }: BalanceCardProps) => {
  const { publicKey, connected } = useWallet();
  const [balanceData, setBalanceData] = useState({
    netWorth: 0,
    solBalance: 0,
    solPrice: 0,
    nftCount: 0,
    stakeCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!connected || !publicKey) {
        setLoading(false);
        return;
      }

      try {
        const connection = new Connection(import.meta.env.VITE_RPC_ENDPOINT);
        
        const [solBalance, solPrice, tokenAccounts, stakeAccounts] = await Promise.all([
          getSolBalance(publicKey, connection),
          getSolPriceInUSD(),
          getTokenAccounts(publicKey, connection),
          getStakeAccounts(publicKey, connection)
        ]);

        // Filter token accounts to count NFTs (simplified approach)
        const nftCount = tokenAccounts.filter(account => 
          account.balance === 1 && account.address // Simple heuristic for NFTs
        ).length;

        setBalanceData({
          netWorth: solBalance * solPrice,
          solBalance,
          solPrice,
          nftCount,
          stakeCount: stakeAccounts.length
        });
      } catch (error) {
        console.error('Error fetching balance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [connected, publicKey]);

  const balanceCards = [
    {
      title: 'Net Value',
      value: `$${balanceData.netWorth.toFixed(2)}`,
      subtext: `${balanceData.solBalance.toFixed(2)} SOL`,
      icon: DollarSign,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Solana Price',
      value: `$${balanceData.solPrice.toFixed(2)}`,
      subtext: 'Current Price',
      icon: PieChart,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'NFTs',
      value: balanceData.nftCount,
      subtext: 'Your NFT Holdings',
      icon: Image,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Stake',
      value: balanceData.stakeCount,
      subtext: 'Active Stakes',
      icon: Fuel,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {Array(4).fill(0).map((_, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-2">
            <div className="animate-pulse">
              <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
              <div className="h-6 w-2/3 bg-gray-200 rounded mt-2"></div>
              <div className="h-3 w-1/2 bg-gray-200 rounded mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {balanceCards.map((card, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-800">00.00</h3>
                <p className="text-gray-400 text-xs mt-1">-</p>
              </div>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {balanceCards.map((card, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-2xl p-6 space-y-2 hover:shadow-md transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">{card.title}</p>
              <h2 className="text-2xl font-bold mt-1 text-gray-800">{card.value}</h2>
              <p className="text-gray-400 text-xs mt-1">{card.subtext}</p>
            </div>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BalanceCard;
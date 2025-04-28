import { useEffect, useState } from 'react';
import { DollarSign, PieChart, Image, Fuel } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { getSolBalance, getSolPriceInUSD, getTokenAccounts, getStakeAccounts } from '../web3plugin/portfolio';

interface BalanceCardProps {
  address?: string;  // Make address optional
}

const BalanceCard = ({ }: BalanceCardProps) => {
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

        const nftCount = tokenAccounts.filter(account =>
          account.balance === 1 && account.address
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
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Solana Price',
      value: `$${balanceData.solPrice.toFixed(2)}`,
      subtext: 'Current Price',
      icon: PieChart,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'NFTs',
      value: balanceData.nftCount,
      subtext: 'Your NFT Holdings',
      icon: Image,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Stake',
      value: balanceData.stakeCount,
      subtext: 'Active Stakes',
      icon: Fuel,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    }
  ];

  const CardSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {Array(4).fill(0).map((_, index) => (
        <div key={index} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-2 animate-pulse">
          <div className="h-4 w-1/3 bg-gray-700 rounded"></div>
          <div className="h-6 w-2/3 bg-gray-700 rounded mt-2"></div>
          <div className="h-3 w-1/2 bg-gray-700 rounded mt-2"></div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return <CardSkeleton />;
  }

  const CardContent = ({ card }: { card: typeof balanceCards[number] }) => (
    <div
      className="bg-gray-800 border border-purple-500/20 rounded-2xl p-6 hover:shadow-purple-500/20 hover:shadow-md transition-all space-y-2"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-purple-400 text-xs">{card.title}</p>
          <h2 className="text-2xl font-bold mt-1 text-white">{card.value}</h2>
          <p className="text-gray-400 text-xs mt-1">{card.subtext}</p>
        </div>
        <div className={`p-2 rounded-lg ${card.bgColor}`}>
          <card.icon className={`w-5 h-5 ${card.color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {balanceCards.map((card, index) => (
        <CardContent key={index} card={card} />
      ))}
    </div>
  );
};

export default BalanceCard;

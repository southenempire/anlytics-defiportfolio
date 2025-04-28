import React, { useState, useEffect } from 'react';
import { fetchWalletPortfolio, PortfolioData } from '../../types/watchwalletapi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Wallet, Plus, X, ChevronRight } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WalletCardProps {
  address: string;
  portfolio: PortfolioData;
  onRemove: () => void;
  isSelected: boolean;
  onSelect: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({ address, portfolio, onRemove, isSelected, onSelect }) => {
  const solBalance = parseFloat(portfolio.nativeBalance.solana || '0').toFixed(4);
  
  return (
    <div 
      className={`p-4 rounded-lg transition-all cursor-pointer ${isSelected ? 'bg-gray-700 border-purple-500' : 'bg-gray-800 hover:bg-gray-700/80'} border border-gray-700`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-purple-500' : 'bg-gray-500'}`}></div>
          <h3 className="font-medium text-gray-200">{address.slice(0, 6)}...{address.slice(-4)}</h3>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }} 
          className="text-gray-400 hover:text-gray-200 p-1 rounded-full hover:bg-gray-600"
        >
          <X size={16} />
        </button>
      </div>
      <div className="mt-2 text-sm text-gray-400 flex items-center">
        <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent font-medium">
          {solBalance} SOL
        </span>
        <ChevronRight size={16} className="ml-1 text-gray-500" />
      </div>
    </div>
  );
};

const WalletPortfolio: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [wallets, setWallets] = useState<{address: string; portfolio: PortfolioData}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  useEffect(() => {
    const savedWallets = localStorage.getItem('savedWallets');
    if (savedWallets) setWallets(JSON.parse(savedWallets));
  }, []);

  useEffect(() => {
    localStorage.setItem('savedWallets', JSON.stringify(wallets));
  }, [wallets]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }
    
    if (wallets.some(w => w.address === walletAddress)) {
      setError('Wallet already tracked');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const portfolioData = await fetchWalletPortfolio(walletAddress);
      const newWallets = [...wallets, { address: walletAddress, portfolio: portfolioData }];
      setWallets(newWallets);
      setSelectedWallet(walletAddress);
      setWalletAddress('');
    } catch (err) {
      setError('Failed to fetch wallet data');
    } finally {
      setIsLoading(false);
    }
  };

  const removeWallet = (address: string) => {
    const newWallets = wallets.filter(w => w.address !== address);
    setWallets(newWallets);
    if (selectedWallet === address) {
      setSelectedWallet(newWallets[0]?.address || null);
    }
  };

  const selectedPortfolio = wallets.find(w => w.address === selectedWallet)?.portfolio;

  // Chart data
  const chartData = {
    labels: ['1D', '1W', '1M', '3M', '6M', '1Y'],
    datasets: [
      {
        label: 'SOL Balance',
        data: [5.2, 5.8, 6.2, 7.0, 6.5, 8.2],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(17, 24, 39)',
        pointBorderColor: 'rgb(139, 92, 246)',
        pointBorderWidth: 2
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgb(31, 41, 55)',
        titleFont: {
          size: 14,
          color: 'rgb(209, 213, 219)'
        },
        bodyFont: {
          size: 12,
          color: 'rgb(209, 213, 219)'
        },
        padding: 12,
        cornerRadius: 8,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: 'rgba(55, 65, 81, 0.5)'
        },
        ticks: {
          color: '#9CA3AF'
        }
      },
      y: {
        grid: {
          color: 'rgba(55, 65, 81, 0.5)'
        },
        ticks: {
          color: '#9CA3AF'
        }
      }
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left Column - 70% */}
        <div className="lg:w-[70%] space-y-6">
          {/* Chart Section */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-200">
                {selectedWallet ? (
                  <span className="flex items-center gap-2">
                    <Wallet size={20} className="text-purple-500" />
                    <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {selectedWallet.slice(0, 6)}...{selectedWallet.slice(-4)} Portfolio
                    </span>
                  </span>
                ) : 'Select a Wallet'}
              </h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300">1D</button>
                <button className="px-3 py-1 text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md">1W</button>
                <button className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300">1M</button>
                <button className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300">1Y</button>
              </div>
            </div>
            
            <div className="h-80">
              {selectedWallet ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Select a wallet to view portfolio chart
                </div>
              )}
            </div>
          </div>
          
          {/* Wallet List Section */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-200">Tracked Wallets</h3>
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                {wallets.length} wallet{wallets.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-3">
              {wallets.length > 0 ? (
                wallets.map(wallet => (
                  <WalletCard
                    key={wallet.address}
                    address={wallet.address}
                    portfolio={wallet.portfolio}
                    onRemove={() => removeWallet(wallet.address)}
                    onSelect={() => setSelectedWallet(wallet.address)}
                    isSelected={selectedWallet === wallet.address}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 border border-gray-700 rounded-lg">
                  No wallets tracked yet
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column - 30% */}
        <div className="lg:w-[30%]">
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <Plus size={20} className="text-purple-500" />
              <span>Add Wallet</span>
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Solana Address</label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter wallet address"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !walletAddress.trim()}
                className={`w-full py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                  isLoading || !walletAddress.trim() 
                    ? 'bg-gray-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-pulse">Adding...</span>
                  </span>
                ) : 'Track Wallet'}
              </button>
              
              {error && (
                <div className="bg-red-900/30 border border-red-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-400">
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}
            </form>
            
            {selectedPortfolio && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <span>Portfolio Details</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Native Balance</h4>
                    <p className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {parseFloat(selectedPortfolio.nativeBalance.solana || '0').toFixed(4)} SOL
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {selectedPortfolio.nativeBalance.lamports || '0'} Lamports
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Tokens</h4>
                      <p className="text-xl font-semibold text-gray-200">
                        {selectedPortfolio.tokens.length}
                      </p>
                    </div>
                    
                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">NFTs</h4>
                      <p className="text-xl font-semibold text-gray-200">
                        {selectedPortfolio.nfts.length}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Top Tokens</h4>
                    {selectedPortfolio.tokens.slice(0, 3).map((token, i) => (
                      <div key={i} className="flex justify-between py-2 border-b border-gray-600 last:border-0">
                        <span className="text-gray-300">{token.symbol || 'Unknown'}</span>
                        <span className="font-medium text-gray-200">{token.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPortfolio;
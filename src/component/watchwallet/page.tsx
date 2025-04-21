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
      className={`p-4 rounded-lg transition-all cursor-pointer ${isSelected ? 'bg-gray-100 border-blue-400' : 'bg-white hover:bg-gray-50'} border`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          <h3 className="font-medium text-gray-800">{address.slice(0, 6)}...{address.slice(-4)}</h3>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }} 
          className="text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        <p>SOL: {solBalance}</p>
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
    if (!walletAddress.trim()) return;
    
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

  // Chart data - replace with real historical data
  const chartData = {
    labels: ['1D', '1W', '1M', '3M', '6M', '1Y'],
    datasets: [
      {
        label: 'SOL Balance',
        data: [5.2, 5.8, 6.2, 7.0, 6.5, 8.2],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'white',
        pointBorderColor: 'rgb(59, 130, 246)',
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 12
        },
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280'
        }
      },
      y: {
        grid: {
          color: 'rgba(229, 231, 235, 0.5)'
        },
        ticks: {
          color: '#6B7280'
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left Column - 70% */}
        <div className="lg:w-[70%] space-y-6">
          {/* Chart Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedWallet ? `${selectedWallet.slice(0, 6)}...${selectedWallet.slice(-4)} Portfolio` : 'Select a Wallet'}
              </h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600">1D</button>
                <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md">1W</button>
                <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600">1M</button>
                <button className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600">1Y</button>
              </div>
            </div>
            
            <div className="h-80">
              {selectedWallet ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Select a wallet to view portfolio chart
                </div>
              )}
            </div>
          </div>
          
          {/* Wallet List Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tracked Wallets</h3>
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
                <div className="text-center py-8 text-gray-400">
                  No wallets tracked yet
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column - 30% */}
        <div className="lg:w-[30%]">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Wallet</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Solana Address</label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter wallet address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !walletAddress.trim()}
                className={`w-full py-2.5 rounded-lg font-medium text-white transition ${isLoading || !walletAddress.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isLoading ? 'Adding...' : 'Track Wallet'}
              </button>
              
              {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
            </form>
            
            {selectedPortfolio && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Portfolio Details</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Native Balance</h4>
                    <p className="text-2xl font-semibold text-gray-800">
                      {parseFloat(selectedPortfolio.nativeBalance.solana || '0').toFixed(4)} SOL
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedPortfolio.nativeBalance.lamports || '0'} Lamports
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Tokens</h4>
                      <p className="text-xl font-semibold text-gray-800">
                        {selectedPortfolio.tokens.length}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">NFTs</h4>
                      <p className="text-xl font-semibold text-gray-800">
                        {selectedPortfolio.nfts.length}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Top Tokens</h4>
                    {selectedPortfolio.tokens.slice(0, 3).map((token, i) => (
                      <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-700">{token.symbol || 'Unknown'}</span>
                        <span className="font-medium">{token.amount}</span>
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
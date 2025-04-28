import { useState, useEffect } from 'react';
import { useTokenMetadata } from '../../hooks/useTokenMetadata';
import { popularSolanaTokens } from '../../types/solanatoken';
import { fetchTokenHolderDistribution, TokenHolderDistribution } from '../../types/tokenholders';
import MetadataDisplay from '../tradetoken/bubblemapstokendisplay/matadataDisplay';
import { ArrowUpRight, ChevronDown, Loader, AlertCircle, CheckCircle, BarChart2, PieChart, Users, TrendingUp } from 'lucide-react';

const SolanaTokenMetadata = () => {
  const [selectedToken, setSelectedToken] = useState(popularSolanaTokens[0]);
  const [holderDistribution, setHolderDistribution] = useState<TokenHolderDistribution | null>(null);
  const [distributionLoading, setDistributionLoading] = useState(false);
  const [distributionError, setDistributionError] = useState<string | null>(null);
  const { metadata, loading, error } = useTokenMetadata(selectedToken.address);

  useEffect(() => {
    setDistributionError(null);
    
    const loadDistribution = async () => {
      setDistributionLoading(true);
      try {
        const distribution = await fetchTokenHolderDistribution(selectedToken.address);
        setHolderDistribution(distribution);
      } catch (err) {
        console.error("Error loading distribution data:", err);
        setDistributionError("Failed to load holder distribution");
      } finally {
        setDistributionLoading(false);
      }
    };
    
    loadDistribution();
  }, [selectedToken.address]);

  const getBubblemapsUrl = (address: string) => {
    return `https://app.bubblemaps.io/sol/token/${address}`;
  };

  const getJupiterUrl = (address: string) => {
    return `https://jup.ag/swap/SOL-${address}`;
  };

  const renderHolderDistribution = () => {
    if (!holderDistribution) return null;
    
    const categories = [
      { name: 'Whales', value: holderDistribution.holderDistribution.whales, color: 'bg-blue-500' },
      { name: 'Sharks', value: holderDistribution.holderDistribution.sharks, color: 'bg-indigo-500' },
      { name: 'Dolphins', value: holderDistribution.holderDistribution.dolphins, color: 'bg-purple-500' },
      { name: 'Fish', value: holderDistribution.holderDistribution.fish, color: 'bg-green-500' },
      { name: 'Octopus', value: holderDistribution.holderDistribution.octopus, color: 'bg-yellow-500' },
      { name: 'Crabs', value: holderDistribution.holderDistribution.crabs, color: 'bg-orange-500' },
      { name: 'Shrimps', value: holderDistribution.holderDistribution.shrimps, color: 'bg-red-500' },
    ];
    
    const totalHolders = holderDistribution.totalHolders;
    
    return (
      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-200 flex items-center gap-2">
            <Users className="text-blue-400" size={18} />
            Holder Distribution
          </h3>
          <span className="text-sm font-medium bg-blue-900/30 text-blue-400 px-2.5 py-0.5 rounded">
            {totalHolders.toLocaleString()} total holders
          </span>
        </div>
        
        <div className="flex mb-2 h-3 rounded-md overflow-hidden bg-gray-700">
          {categories.map((category, index) => {
            const percentage = (category.value / totalHolders) * 100;
            return percentage > 0 ? (
              <div 
                key={index} 
                className={`${category.color} h-full transition-all`} 
                style={{ width: `${percentage > 0.5 ? percentage : 0.5}%` }}
                title={`${category.name}: ${category.value.toLocaleString()} (${percentage.toFixed(2)}%)`}
              ></div>
            ) : null;
          })}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-4">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-2 h-2 ${category.color} rounded-sm mr-2`}></div>
              <div>
                <p className="text-xs font-medium text-gray-300">{category.name}</p>
                <p className="text-xs text-gray-400">
                  {category.value.toLocaleString()} ({((category.value / totalHolders) * 100).toFixed(2)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Holder Change Section */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="text-purple-400" size={16} />
            <h4 className="text-xs font-medium text-gray-300">Holder Change</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {Object.entries(holderDistribution.holderChange).map(([period, data]) => (
              <div key={period} className="bg-gray-700/50 p-2 rounded border border-gray-700 hover:bg-gray-700 transition-all">
                <p className="text-xs text-gray-400 capitalize">{period}</p>
                <p className={`text-sm font-medium ${data.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500">
                  {data.change >= 0 ? '+' : ''}{data.change.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Acquisition Method */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="text-yellow-400" size={16} />
            <h4 className="text-xs font-medium text-gray-300">Acquisition Method</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {Object.entries(holderDistribution.holdersByAcquisition).map(([method, count]) => (
              <div key={method} className="bg-gray-700/50 p-2 rounded border border-gray-700 hover:bg-gray-700 transition-all">
                <p className="text-xs text-gray-400 capitalize">{method.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="text-sm font-medium text-gray-200">{count.toLocaleString()}</p>
                <p className="text-xs text-gray-500">
                  {((count / totalHolders) * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart2 className="text-purple-500" size={24} />
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                Solana Token Analytics
              </h2>
            </div>
            <p className="text-gray-400 text-sm">Analyze token distribution and metrics</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={getBubblemapsUrl(selectedToken.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all flex items-center gap-2 text-sm border border-gray-600 hover:border-gray-500"
            >
              <span>Bubblemaps</span>
              <ArrowUpRight size={16} />
            </a>
            <a
              href={getJupiterUrl(selectedToken.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all flex items-center gap-2 text-sm"
            >
              <span>Trade on Jupiter</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        
        {/* Token Selector */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
          <div className="flex flex-nowrap gap-2">
            {popularSolanaTokens.map(token => (
              <button
                key={token.address}
                onClick={() => setSelectedToken(token)}
                className={`px-3 py-1.5 rounded-lg text-sm flex items-center whitespace-nowrap transition-all border ${
                  selectedToken.address === token.address
                    ? 'bg-purple-900/30 text-purple-400 border-purple-700'
                    : 'bg-gray-700 hover:bg-gray-600 border-gray-600'
                }`}
              >
                {token.logo && (
                  <img 
                    src={token.logo} 
                    alt={token.name} 
                    className="w-5 h-5 mr-2 rounded-full" 
                  />
                )}
                {token.symbol}
                {selectedToken.address === token.address && (
                  <ChevronDown className="ml-1" size={16} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Metadata Section */}
        <div className="mb-6">
          {loading ? (
            <div className="text-center py-8 bg-gray-800/50 rounded-lg border border-gray-700">
              <Loader className="mx-auto animate-spin text-purple-500 mb-2" size={24} />
              <p className="text-gray-400">Loading {selectedToken.name} metadata...</p>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle size={18} />
                <h3 className="font-medium">
                  {error.includes("Data not available") 
                    ? `No metadata available for ${selectedToken.name}`
                    : 'Error loading metadata'}
                </h3>
              </div>
              {!error.includes("Data not available") && (
                <p className="mt-1 text-sm text-red-300">{error}</p>
              )}
            </div>
          ) : metadata ? (
            <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
              <div className="bg-gray-700 px-4 py-3 flex items-center gap-2">
                <CheckCircle size={18} className="text-green-400" />
                <h3 className="font-medium text-gray-200">Token Metadata</h3>
              </div>
              <div className="p-4">
                <MetadataDisplay metadata={metadata} />
              </div>
            </div>
          ) : null}
        </div>

        {/* Distribution Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <PieChart className="text-blue-400" size={20} />
            <h3 className="font-semibold text-gray-200">Token Distribution</h3>
          </div>
          
          {distributionLoading ? (
            <div className="text-center py-8 bg-gray-800/50 rounded-lg border border-gray-700">
              <Loader className="mx-auto animate-spin text-purple-500 mb-2" size={24} />
              <p className="text-gray-400">Loading holder distribution data...</p>
            </div>
          ) : distributionError ? (
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle size={18} />
                <h3 className="font-medium">{distributionError}</h3>
              </div>
            </div>
          ) : holderDistribution ? (
            renderHolderDistribution()
          ) : (
            <div className="text-center py-8 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="mx-auto h-10 w-10 text-gray-500 mb-2">
                <PieChart size={40} />
              </div>
              <h4 className="mt-2 text-sm font-medium text-gray-300">No distribution data</h4>
              <p className="mt-1 text-xs text-gray-500">Couldn't load token distribution information</p>
            </div>
          )}
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-700">
          Data provided by on-chain analytics
        </div>
      </div>
    </div>
  );
};

export default SolanaTokenMetadata;
// src/components/SolanaTokenMetadata.tsx
import { useState, useEffect } from 'react';
import { useTokenMetadata } from '../../hooks/useTokenMetadata';
import { popularSolanaTokens } from '../../types/solanatoken';
import { fetchTokenHolderDistribution, TokenHolderDistribution } from '../../types/tokenholders';
import MetadataDisplay from '../tradetoken/bubblemapstokendisplay/matadataDisplay';

const SolanaTokenMetadata = () => {
  const [selectedToken, setSelectedToken] = useState(popularSolanaTokens[0]);
  const [holderDistribution, setHolderDistribution] = useState<TokenHolderDistribution | null>(null);
  const [distributionLoading, setDistributionLoading] = useState(false);
  const [distributionError, setDistributionError] = useState<string | null>(null);
  const { metadata, loading, error } = useTokenMetadata(selectedToken.address);

  useEffect(() => {
    // Clear any previous errors
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
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Holder Distribution
          </h3>
          <span className="text-sm font-medium bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded">
            {totalHolders.toLocaleString()} total holders
          </span>
        </div>
        
        <div className="flex mb-2 h-6 rounded-md overflow-hidden">
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
              <div className={`w-3 h-3 ${category.color} rounded-sm mr-2`}></div>
              <div>
                <p className="text-xs font-medium text-gray-700">{category.name}</p>
                <p className="text-xs text-gray-500">
                  {category.value.toLocaleString()} ({((category.value / totalHolders) * 100).toFixed(2)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Holder Change Section */}
        <div className="mt-6">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Holder Change</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {Object.entries(holderDistribution.holderChange).map(([period, data]) => (
              <div key={period} className="bg-white p-2 rounded border border-gray-100 hover:shadow-sm transition-all">
                <p className="text-xs text-gray-500">{period}</p>
                <p className={`text-sm font-medium ${data.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-400">
                  {data.change >= 0 ? '+' : ''}{data.change.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Acquisition Method */}
        <div className="mt-6">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Acquisition Method</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {Object.entries(holderDistribution.holdersByAcquisition).map(([method, count]) => (
              <div key={method} className="bg-white p-2 rounded border border-gray-100 hover:shadow-sm transition-all">
                <p className="text-xs text-gray-500 capitalize">{method}</p>
                <p className="text-sm font-medium text-gray-800">{count.toLocaleString()}</p>
                <p className="text-xs text-gray-400">
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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Solana Token Analytics</h2>
          <p className="text-gray-500 text-sm">Analyze token distribution and metrics</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={getBubblemapsUrl(selectedToken.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-sm text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4 7l8 5 8-5-8-5zm0 14L4 11l8 5 8-5-8-5z"/>
            </svg>
            Bubblemaps
          </a>
          <a
            href={getJupiterUrl(selectedToken.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all flex items-center gap-2 shadow-sm text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
            Jupiter
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
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center whitespace-nowrap transition-all ${
                selectedToken.address === token.address
                  ? 'bg-blue-100 text-blue-600 shadow-inner'
                  : 'bg-gray-50 hover:bg-gray-100'
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
            </button>
          ))}
        </div>
      </div>

      {/* Metadata Section */}
      <div className="mb-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p>Loading {selectedToken.name} metadata...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <h3 className="text-red-800 font-medium">
                {error.includes("Data not available") 
                  ? `No metadata available for ${selectedToken.name}`
                  : 'Error loading metadata'}
              </h3>
            </div>
            {!error.includes("Data not available") && (
              <p className="text-red-600 mt-1 text-sm">{error}</p>
            )}
          </div>
        ) : metadata ? (
          <MetadataDisplay metadata={metadata} />
        ) : null}
      </div>

      {/* Distribution Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Token Distribution</h3>
        
        {distributionLoading ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p>Loading holder distribution data...</p>
          </div>
        ) : distributionError ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <h3 className="text-red-800 font-medium">
                {distributionError}
              </h3>
            </div>
          </div>
        ) : holderDistribution ? (
          renderHolderDistribution()
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="mt-2 text-sm font-medium text-gray-700">No distribution data</h4>
            <p className="mt-1 text-xs text-gray-500">Couldn't load token distribution information</p>
          </div>
        )}
      </div>
      
      <div className="text-center text-xs text-gray-400 mt-8 pt-4 border-t border-gray-100">
        Data provided by on-chain analytics
      </div>
    </div>
  );
};

export default SolanaTokenMetadata;
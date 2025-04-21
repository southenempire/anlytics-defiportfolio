import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DollarSign,
  PieChart,
  TrendingUp,
  CheckCircle,
  Circle,
  ArrowRight,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import { useTokenMetadata } from '../../hooks/useTokenMetadata';
import MetadataDisplay from './bubblemapstokendisplay/matadataDisplay';
import { TokenDetails } from '../../types/bubblemap';

function TokenDetailsWithSwap() {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState<TokenDetails | null>(null);
  const { metadata, loading, error } = useTokenMetadata(token?.address || null);

  useEffect(() => {
    if (location.state?.token) {
      setToken(location.state.token);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading token details...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
      >
        <ArrowLeft className="mr-1" size={18} />
        Back to tokens
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Token Details Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Token Details</h2>

            <div className="flex items-center mb-6">
              <img
                src={token.logo}
                alt={`${token.name} logo`}
                className="w-12 h-12 rounded-full mr-4 border border-gray-300"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-800">{token.name}</h3>
                <p className="text-sm text-gray-500">{token.symbol}</p>
                <p className="text-sm text-gray-500 truncate max-w-[180px] md:max-w-[220px]">
                  {token.address}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <DollarSign className="mr-2" size={16} />
                  <span className="hidden sm:inline">Price (SOL)</span>
                </span>
                <span className="font-medium text-gray-800">
                  {token.priceNative}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <DollarSign className="mr-2" size={16} />
                  <span className="hidden sm:inline">Price (USD)</span>
                </span>
                <span className="font-medium text-gray-800">
                  ${token.price.toFixed(token.price > 1 ? 2 : 4)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <PieChart className="mr-2" size={16} />
                  <span className="hidden sm:inline">Liquidity</span>
                </span>
                <span className="font-medium text-gray-800">
                  {token.liquidity >= 1000000
                    ? `$${(token.liquidity / 1000000).toFixed(1)}M`
                    : `$${(token.liquidity / 1000).toFixed(1)}K`}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <TrendingUp className="mr-2" size={16} />
                  <span className="hidden sm:inline">FDV</span>
                </span>
                <span className="font-medium text-gray-800">
                  {token.fdv >= 1000000
                    ? `$${(token.fdv / 1000000).toFixed(1)}M`
                    : `$${(token.fdv / 1000).toFixed(1)}K`}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <div className="flex items-center">
                  {token.status === 'Good' ? (
                    <CheckCircle className="mr-1 text-green-500" size={16} />
                  ) : (
                    <Circle className="mr-1 text-red-500" size={16} />
                  )}
                  <span className={`font-medium ${token.status === 'Good' ? 'text-green-500' : 'text-red-500'}`}>
                    {token.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Swap UI Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Swap Tokens</h2>

            <div className="space-y-4">
              {/* From Input */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between mb-2 text-sm sm:text-base">
                  <span className="text-gray-600">From</span>
                  <span className="text-gray-600">Balance: 0.0</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    placeholder="0.0"
                    className="flex-1 bg-transparent text-xl sm:text-2xl outline-none"
                  />
                  <button className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-lg px-2 sm:px-3 py-1 sm:py-2 transition-colors text-sm sm:text-base">
                    <img
                      src={token.logo}
                      alt={`${token.name} logo`}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full mr-1 sm:mr-2"
                    />
                    <span className="truncate max-w-[60px] sm:max-w-none">{token.symbol}</span>
                    <ChevronDown className="ml-1" size={16} />
                  </button>
                </div>
              </div>

              {/* Swap Arrow */}
              <div className="flex justify-center">
                <button className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors">
                  <ArrowRight size={20} />
                </button>
              </div>

              {/* To Input */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between mb-2 text-sm sm:text-base">
                  <span className="text-gray-600">To</span>
                  <span className="text-gray-600">Balance: 0.0</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    placeholder="0.0"
                    className="flex-1 bg-transparent text-xl sm:text-2xl outline-none"
                  />
                  <button className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-lg px-2 sm:px-3 py-1 sm:py-2 transition-colors text-sm sm:text-base">
                    <span className="mr-1 sm:mr-2 truncate max-w-[40px] sm:max-w-none">Select</span>
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>

              {/* Swap Button */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-3 px-4 rounded-xl transition-colors text-sm sm:text-base">
                Swap
              </button>

              {/* Price Info */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-gray-600">
                <div className="flex justify-between mb-1">
                  <span>Price</span>
                  <span className="truncate max-w-[150px] sm:max-w-none">1 {token.symbol} = {token.priceNative} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span>Slippage</span>
                  <span>0.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Bubblemaps Metadata Display */}
        <div className="mt-8">
          {loading && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 text-center">
              <div className="flex justify-center items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading token distribution data...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 text-center">
              <div className="text-red-500 mb-2">
                <svg className="w-6 h-6 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900">Couldn't load data</h3>
              <p className="text-gray-600 mt-1">We're having trouble loading the distribution information.</p>
              <p className="text-gray-500 text-sm mt-2">Technical details: {error}</p>
            </div>
          )}

          {metadata && <MetadataDisplay metadata={metadata} />}
        </div>
      </div>
    </div>
  );
}

export default TokenDetailsWithSwap;
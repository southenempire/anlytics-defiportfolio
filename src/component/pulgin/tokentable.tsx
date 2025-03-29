import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  PieChart,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import { fetchNewPumpFunTokens } from '../web3plugin/pumpfun';

interface PumpFunToken {
  tokenAddress: string;
  name: string;
  symbol: string;
  logo: string;
  decimals: string;
  priceNative: string;
  priceUsd: string;
  liquidity: string;
  fullyDilutedValuation: string;
  createdAt: string;
}

// Compact number formatter
function compactNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toFixed(2);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

function TokenCardTable() {
  const [tokens, setTokens] = useState<PumpFunToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleTrade = (token: PumpFunToken) => {
    navigate('/swap', {
      state: {
        token: {
          name: token.name,
          logo: token.logo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMuEk2crxx1x5z5OppCdwEVc2mwJnm7PIL6g&s',
          price: parseFloat(token.priceUsd),
          address: token.tokenAddress,
          liquidity: parseFloat(token.liquidity),
          fdv: parseFloat(token.fullyDilutedValuation || '0'),
          status: 'Good',
          priceNative: token.priceNative,
          symbol: token.symbol
        }
      }
    });
  };

  useEffect(() => {
    async function loadTokens() {
      try {
        setIsLoading(true);
        const fetchedTokens = await fetchNewPumpFunTokens(20);
        setTokens(fetchedTokens);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tokens');
        setIsLoading(false);
      }
    }

    loadTokens();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 text-center">
        Loading degen tokens... 🚀
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 text-center text-red-500">
        Oops! {error}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-x-auto">
      {/* Section Header */}
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">🔥 New PumpFun Tokens</h2>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block w-full">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 p-4 bg-gray-100 border-b border-gray-200 text-xs">
          <div className="col-span-3 font-semibold text-gray-600">Token</div>
          <div className="col-span-1 font-semibold text-gray-600">Name</div>
          <div className="col-span-1 font-semibold text-gray-600">SOL</div>
          <div className="col-span-1 font-semibold text-gray-600">USD</div>
          <div className="col-span-2 font-semibold text-gray-600">Liquidity</div>
          <div className="col-span-2 font-semibold text-gray-600">FDV</div>
          <div className="col-span-1 font-semibold text-gray-600">Created</div>
          <div className="col-span-1 font-semibold text-gray-600">Action</div>
        </div>
        
        {/* Table Rows */}
        {tokens.map((token, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 p-3 items-center border-b border-gray-200 text-xs hover:bg-gray-50 transition-colors">
            {/* Token Column */}
            <div className="col-span-3 flex items-center">
              <img
                src={token.logo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMuEk2crxx1x5z5OppCdwEVc2mwJnm7PIL6g&s'}
                alt={`${token.symbol || 'Unknown'} logo`}
                className="w-6 h-6 rounded-full mr-2 border border-gray-300"
              />
              <div>
                <h3 className="font-bold text-gray-800">{token.symbol || 'Unknown'}</h3>
                <p className="text-[10px] text-gray-500 truncate">
                  {`${token.tokenAddress.substring(0, 4)}...${token.tokenAddress.substring(token.tokenAddress.length - 4)}`}
                </p>
              </div>
            </div>
            
            {/* Name Column */}
            <div className="col-span-1 truncate">
              <span className="font-medium text-gray-800 truncate" title={token.name}>
                {token.name || 'N/A'}
              </span>
            </div>
            
            {/* Price (SOL) Column */}
            <div className="col-span-1">
              <span className="font-medium text-gray-800">{token.priceNative}</span>
            </div>
            
            {/* Price (USD) Column */}
            <div className="col-span-1">
              <span className="font-medium text-gray-800">
                {compactNumber(parseFloat(token.priceUsd))}
              </span>
            </div>
            
            {/* Liquidity Column */}
            <div className="col-span-2">
              <span className="font-medium text-gray-800">
                {compactNumber(parseFloat(token.liquidity))}
              </span>
            </div>
            
            {/* FDV Column */}
            <div className="col-span-2">
              <span className="font-medium text-gray-800">
                {token.fullyDilutedValuation 
                  ? compactNumber(parseFloat(token.fullyDilutedValuation)) 
                  : 'N/A'}
              </span>
            </div>
            
            {/* Created Column */}
            <div className="col-span-1">
              <span className="font-medium text-gray-800">
                {formatDate(token.createdAt)}
              </span>
            </div>
            
            {/* Action Column */}
            <div className="col-span-1">
              <button 
                onClick={() => handleTrade(token)}
                className="flex items-center justify-center w-full py-1 px-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors"
              >
                <ArrowRight size={14} className="mr-1" />
                Trade
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {tokens.map((token, index) => (
          <div key={index} className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
            <div className="flex items-center mb-3">
              <img
                src={token.logo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMuEk2crxx1x5z5OppCdwEVc2mwJnm7PIL6g&s'}
                alt={`${token.symbol || 'Unknown'} logo`}
                className="w-8 h-8 rounded-full mr-3 border border-gray-300"
              />
              <div>
                <h3 className="font-bold text-gray-800">{token.symbol || 'Unknown'}</h3>
                <p className="text-xs text-gray-500 truncate">
                  {token.name || 'Unnamed token'}
                </p>
                <p className="text-[10px] text-gray-500 truncate">
                  {`${token.tokenAddress.substring(0, 4)}...${token.tokenAddress.substring(token.tokenAddress.length - 4)}`}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <DollarSign className="mr-1 text-gray-400" size={12} />
                <span className="text-gray-800">SOL: {token.priceNative}</span>
              </div>
              
              <div className="flex items-center">
                <DollarSign className="mr-1 text-gray-400" size={12} />
                <span className="text-gray-800">
                  USD: {compactNumber(parseFloat(token.priceUsd))}
                </span>
              </div>
              
              <div className="flex items-center">
                <PieChart className="mr-1 text-gray-400" size={12} />
                <span className="text-gray-800">
                  Liq: {compactNumber(parseFloat(token.liquidity))}
                </span>
              </div>
              
              <div className="flex items-center">
                <TrendingUp className="mr-1 text-gray-400" size={12} />
                <span className="text-gray-800">
                  FDV: {token.fullyDilutedValuation 
                    ? compactNumber(parseFloat(token.fullyDilutedValuation)) 
                    : 'N/A'}
                </span>
              </div>

              <div className="col-span-2 flex items-center pt-2">
                <Clock className="mr-1 text-gray-400" size={12} />
                <span className="text-gray-800">
                  Created: {formatDate(token.createdAt)}
                </span>
              </div>
            </div>

            {/* Trade Button for Mobile */}
            <div className="mt-3">
              <button 
                onClick={() => handleTrade(token)}
                className="w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors flex items-center justify-center"
              >
                <ArrowRight size={16} className="mr-2" />
                Trade {token.symbol || 'Token'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TokenCardTable;
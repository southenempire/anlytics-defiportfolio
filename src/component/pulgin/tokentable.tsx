import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  PieChart,
  TrendingUp,
  Clock,
  ArrowRight,
  Loader,
  AlertCircle
} from 'lucide-react';
import { fetchNewPumpFunTokens } from '../web3plugin/pumpfun';

// Define the PumpFunToken interface
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

// Utility functions
function compactNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toFixed(2);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Main Component
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tokens');
      } finally {
        setIsLoading(false);
      }
    }

    loadTokens();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-gray-100">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <PieChart className="text-purple-500" size={24} />
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            New PumpFun Tokens
          </h2>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-20">
            <Loader className="animate-spin text-purple-400" size={20} />
            <p className="text-sm">Loading degen tokens...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle size={18} />
              <p className="font-medium">Error</p>
            </div>
            <p className="mt-1 text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Token List */}
        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <div className="hidden md:block w-full">
              <div className="grid grid-cols-12 gap-2 p-4 bg-gray-700/50 rounded-t-lg text-xs">
                <div className="col-span-3 font-semibold">Token</div>
                <div className="col-span-1 font-semibold">Name</div>
                <div className="col-span-1 font-semibold">SOL</div>
                <div className="col-span-1 font-semibold">USD</div>
                <div className="col-span-2 font-semibold">Liquidity</div>
                <div className="col-span-2 font-semibold">FDV</div>
                <div className="col-span-1 font-semibold">Created</div>
                <div className="col-span-1 font-semibold">Action</div>
              </div>

              {tokens.map((token, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 p-4 items-center border-t border-gray-700 hover:bg-gray-700/30 transition-colors text-sm"
                >
                  <div className="col-span-3 flex items-center gap-2">
                    <img
                      src={token.logo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMuEk2crxx1x5z5OppCdwEVc2mwJnm7PIL6g&s'}
                      alt="Logo"
                      className="w-6 h-6 rounded-full border border-gray-600"
                    />
                    <div>
                      <p className="font-bold">{token.symbol}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {`${token.tokenAddress.slice(0, 4)}...${token.tokenAddress.slice(-4)}`}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-1 truncate">{token.name || 'N/A'}</div>
                  <div className="col-span-1">{token.priceNative}</div>
                  <div className="col-span-1">{compactNumber(parseFloat(token.priceUsd))}</div>
                  <div className="col-span-2">{compactNumber(parseFloat(token.liquidity))}</div>
                  <div className="col-span-2">
                    {token.fullyDilutedValuation 
                      ? compactNumber(parseFloat(token.fullyDilutedValuation)) 
                      : 'N/A'}
                  </div>
                  <div className="col-span-1">{formatDate(token.createdAt)}</div>

                  <div className="col-span-1">
                    <button
                      onClick={() => handleTrade(token)}
                      className="flex items-center justify-center w-full py-2 px-3 bg-purple-500 hover:bg-purple-600 rounded-lg text-white text-xs"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {tokens.map((token, index) => (
                <div key={index} className="bg-gray-700/30 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={token.logo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMuEk2crxx1x5z5OppCdwEVc2mwJnm7PIL6g&s'}
                      alt="Logo"
                      className="w-8 h-8 rounded-full border border-gray-600"
                    />
                    <div>
                      <h3 className="font-bold">{token.symbol}</h3>
                      <p className="text-xs text-gray-400">{token.name}</p>
                      <p className="text-[10px] text-gray-400">{`${token.tokenAddress.slice(0, 4)}...${token.tokenAddress.slice(-4)}`}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <p><DollarSign size={12} className="inline-block mr-1" /> SOL: {token.priceNative}</p>
                    <p><DollarSign size={12} className="inline-block mr-1" /> USD: {compactNumber(parseFloat(token.priceUsd))}</p>
                    <p><PieChart size={12} className="inline-block mr-1" /> Liq: {compactNumber(parseFloat(token.liquidity))}</p>
                    <p><TrendingUp size={12} className="inline-block mr-1" /> FDV: {token.fullyDilutedValuation ? compactNumber(parseFloat(token.fullyDilutedValuation)) : 'N/A'}</p>
                    <p className="col-span-2"><Clock size={12} className="inline-block mr-1" /> {formatDate(token.createdAt)}</p>
                  </div>

                  <button
                    onClick={() => handleTrade(token)}
                    className="mt-3 w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs flex items-center justify-center"
                  >
                    <ArrowRight size={16} className="mr-1" />
                    Trade
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TokenCardTable;

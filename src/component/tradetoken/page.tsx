import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DollarSign,
  PieChart,
  TrendingUp,
  // CheckCircle,
  // Circle,
  ArrowLeft,
  AlertCircle,
  Loader
} from 'lucide-react';
import { useTokenMetadata } from '../../hooks/useTokenMetadata';
import MetadataDisplay from './bubblemapstokendisplay/matadataDisplay';
import { TokenDetails } from '../../types/bubblemap';

interface JupiterInterface {
  init: (config: any) => void;
  _instance: any;
}

declare global {
  interface Window {
    Jupiter?: JupiterInterface;
  }
}

function TokenDetailsWithSwap() {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState<TokenDetails | null>(null);
  const { metadata, loading, error } = useTokenMetadata(token?.address || null);

  useEffect(() => {
    if (window.Jupiter && token?.address) {
      window.Jupiter.init({
        displayMode: "integrated",
        integratedTargetId: "integrated-terminal",
        endpoint: "https://mainnet.helius-rpc.com/?api-key=4c4a4f43-145d-4406-b89c-36ad977bb738",
        defaultExplorer: "Solscan",
        formProps: {
          initialOutputMint: token.address,
          initialInputMint: "So11111111111111111111111111111111111111112",
          fixedOutputMint: true
        }
      });
    }

    return () => {
      if (window.Jupiter) {
        window.Jupiter._instance = null;
        const terminalElement = document.getElementById('integrated-terminal');
        if (terminalElement) {
          terminalElement.innerHTML = '';
        }
      }
    };
  }, [token?.address]);

  useEffect(() => {
    if (location.state?.token) {
      setToken(location.state.token);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  if (!token) {
    return (
      <div className="bg-gray-900 text-gray-100 min-h-screen p-6 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-gray-800 rounded-xl shadow-lg p-6 text-center">
          <Loader className="animate-spin mx-auto text-purple-500" size={24} />
          <p className="mt-4 text-gray-300">Loading token details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2" size={18} />
          Back to tokens
        </button>

        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Token Details & Swap
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Token Details Card */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
              Token Information
            </h2>

            <div className="flex items-center mb-6">
              <img
                src={token.logo}
                alt={`${token.name} logo`}
                className="w-12 h-12 rounded-full mr-4 border border-purple-500/30"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-100">{token.name}</h3>
                <p className="text-sm text-purple-400">{token.symbol}</p>
                <p className="text-xs text-gray-400 truncate max-w-[180px] md:max-w-[220px]">
                  {token.address}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center">
                  <DollarSign className="mr-2" size={16} />
                  Price (SOL)
                </span>
                <span className="font-medium text-gray-100">
                  {token.priceNative}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center">
                  <DollarSign className="mr-2" size={16} />
                  Price (USD)
                </span>
                <span className="font-medium text-gray-100">
                  ${token.price.toFixed(token.price > 1 ? 2 : 4)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center">
                  <PieChart className="mr-2" size={16} />
                  Liquidity
                </span>
                <span className="font-medium text-gray-100">
                  {token.liquidity >= 1000000
                    ? `$${(token.liquidity / 1000000).toFixed(1)}M`
                    : `$${(token.liquidity / 1000).toFixed(1)}K`}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center">
                  <TrendingUp className="mr-2" size={16} />
                  FDV
                </span>
                <span className="font-medium text-gray-100">
                  {token.fdv >= 1000000
                    ? `$${(token.fdv / 1000000).toFixed(1)}M`
                    : `$${(token.fdv / 1000).toFixed(1)}K`}
                </span>
              </div>

              {/* <div className="flex justify-between items-center">
                <span className="text-gray-400">Status</span>
                <div className="flex items-center">
                  {token.status === 'Good' ? (
                    <CheckCircle className="mr-1 text-green-400" size={16} />
                  ) : (
                    <Circle className="mr-1 text-red-400" size={16} />
                  )}
                  <span className={`font-medium ${token.status === 'Good' ? 'text-green-400' : 'text-red-400'}`}>
                    {token.status}
                  </span>
                </div>
              </div> */}
            </div>
          </div>

          {/* Jupiter Terminal Integration */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-400" />
              Swap Tokens
            </h2>
            <div 
              id="integrated-terminal" 
              className="rounded-lg overflow-hidden border border-gray-700"
              style={{ width: '100%', height: '500px' }}
            ></div>
          </div>
        </div>

        {/* Bubblemaps Metadata Display */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
            <PieChart size={18} className="text-purple-400" />
            Token Distribution
          </h2>

          {loading && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 text-center">
              <div className="flex justify-center items-center gap-2 text-gray-400">
                <Loader className="animate-spin" size={18} />
                <span>Loading token distribution data...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-800 rounded-xl p-6">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <AlertCircle size={18} />
                <h3 className="font-medium">Couldn't load data</h3>
              </div>
              <p className="text-gray-300 mt-1">We're having trouble loading the distribution information.</p>
              <p className="text-gray-400 text-sm mt-2">Technical details: {error}</p>
            </div>
          )}

          {metadata && <MetadataDisplay metadata={metadata} />}
        </div>
      </div>
    </div>
  );
}

export default TokenDetailsWithSwap;
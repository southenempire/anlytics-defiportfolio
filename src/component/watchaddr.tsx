import { useEffect, useState, useCallback, useRef } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSolBalance, getTokenAccounts, getStakeAccounts, getSolPriceInUSD } from './web3plugin/portfolio';
import { useFetchTransactions, SimplifiedTransactionDetail } from './web3plugin/fetchtransaction';
import MultiColorProgressBar from './pulgin/progressbar/page';
import { Search, DollarSign, PieChart, Image, Fuel, Trash2, Plus } from 'lucide-react';
import pLimit from 'p-limit';
import { debounce } from 'lodash';

// Utility function for delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Interface definitions
interface PortfolioItem {
  name: string;
  value: number;
  color: string;
  amount: number;
}

interface TokenAccount {
  address: string;
  balance: number;
}

// Enhanced error handling
const handleApiError = (error: any, defaultMessage: string): string => {
  if (error.code && error.message) {
    // Handle Solana JSON-RPC errors
    return `Solana RPC error: ${error.message} (Code: ${error.code})`;
  } else if (error.response?.status === 429) {
    return 'Rate limit exceeded. Please try again later.';
  } else if (error.message.includes('Network Error')) {
    return 'Network error. Please check your internet connection.';
  } else if (error.response?.status >= 500) {
    return 'Server error. Please try again later.';
  } else if (error.message) {
    return `Error: ${error.message}`;
  }
  return defaultMessage;
};

// Utility to inspect error objects
const inspectError = (error: any): object => ({
  message: error.message,
  code: error.code,
  status: error.response?.status,
  data: error.response?.data || error.data,
  stack: error.stack,
  name: error.name,
});

const WatchAddress = () => {
  const [searchAddress, setSearchAddress] = useState<string>('');
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('solanaWatchlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [portfolioBreakdown, setPortfolioBreakdown] = useState<PortfolioItem[]>([
    { name: 'SOL', value: 0, color: '#030303', amount: 0 },
    { name: 'NFTs', value: 0, color: '#1f2837', amount: 0 },
    { name: 'Stakes', value: 0, color: '#afaeae', amount: 0 },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<SimplifiedTransactionDetail[]>([]);
  const [tokenAccounts, setTokenAccounts] = useState<TokenAccount[]>([]);
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [txError, setTxError] = useState<string | null>(null);
  const [tokenLoading, setTokenLoading] = useState<boolean>(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [balanceData, setBalanceData] = useState({
    netWorth: 0,
    solBalance: 0,
    solPrice: 0,
    nftCount: 0,
    stakeCount: 0,
  });
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);
  const [lastKnownSolPrice, setLastKnownSolPrice] = useState<number>(0);
  const [beforeSignature, setBeforeSignature] = useState<string | undefined>(undefined);
  const initialLoadComplete = useRef(false);
  const transactionCache = useRef<SimplifiedTransactionDetail[]>([]);
  const balanceCache = useRef<{ [address: string]: { data: any; timestamp: number } }>({});
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const fetchTransactions = useFetchTransactions();
  const limit = pLimit(2);

  // Multiple RPC endpoints for fallback
  const rpcEndpoints = [
    import.meta.env.VITE_RPC_ENDPOINT,// Fallback public endpoint
  ];

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('solanaWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Handle search query from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const address = queryParams.get('address');
    if (address) {
      handleAddressSearch(address);
    }
  }, [location.search]);

  const handleAddressSearch = useCallback((address: string) => {
    try {
      new PublicKey(address);
      setSearchAddress(address);
      setSearchError(null);
      setBeforeSignature(undefined);
      transactionCache.current = [];
    } catch (error: any) {
      setSearchError('Invalid Solana address format');
      console.error('Invalid address:', inspectError(error));
    }
  }, []);

  const handleSearchSubmit = debounce((e: React.FormEvent) => {
    e.preventDefault();
    if (searchAddress.trim()) {
      navigate(`/watch?address=${searchAddress.trim()}`);
    }
  }, 500);

  const addToWatchlist = () => {
    if (!searchAddress.trim() || watchlist.includes(searchAddress)) return;
    try {
      new PublicKey(searchAddress);
      setWatchlist([...watchlist, searchAddress]);
    } catch (error: any) {
      setSearchError('Cannot add invalid address to watchlist');
      console.error('Add to watchlist error:', inspectError(error));
    }
  };

  const removeFromWatchlist = (address: string) => {
    setWatchlist(watchlist.filter(addr => addr !== address));
    if (address === searchAddress) {
      setSearchAddress('');
      navigate('/watch');
    }
  };

  // Enhanced retry mechanism
  const withRetry = async <T,>(
    fn: () => Promise<T>,
    maxRetries = 5,
    baseDelay = 1000 // Increased base delay
  ): Promise<T> => {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        return await fn();
      } catch (error: any) {
        retries++;
        const isRetryable = !error.message?.includes('Invalid') && !error.code?.includes('400'); // Skip invalid requests
        if (error.code && error.message.includes('429')) {
          const delayTime = baseDelay * 2 ** retries + Math.random() * 100;
          console.log(`429 error, retrying after ${delayTime}ms...`);
          await delay(delayTime);
        } else if (retries >= maxRetries || !isRetryable) {
          console.error('Max retries reached:', inspectError(error));
          throw error;
        } else {
          const delayTime = baseDelay + Math.random() * 100;
          console.log(`Retrying after ${delayTime}ms...`);
          await delay(delayTime);
        }
      }
    }
    throw new Error('Max retries reached');
  };

  const fetchBalanceData = useCallback(async (address: string) => {
    if (balanceCache.current[address] && Date.now() - balanceCache.current[address].timestamp < 60000) {
      setBalanceData(balanceCache.current[address].data);
      return;
    }

    try {
      setBalanceLoading(true);
      const connection = new Connection(
        rpcEndpoints[Math.floor(Math.random() * rpcEndpoints.length)],
        { commitment: 'confirmed' }
      );
      const pubkey = new PublicKey(address);

      let solBalance = 0, solPrice = 0, tokenAccounts: TokenAccount[] = [], stakeAccounts: any[] = [];
      try {
        solBalance = await limit(() => withRetry(() => getSolBalance(pubkey, connection)));
      } catch (e) {
        console.warn('Failed to fetch SOL balance:', inspectError(e));
      }
      await delay(100);
      try {
        solPrice = await limit(() => withRetry(() => getSolPriceInUSD()));
        setLastKnownSolPrice(solPrice);
      } catch (e) {
        console.warn('Failed to fetch SOL price, using fallback:', lastKnownSolPrice);
        solPrice = lastKnownSolPrice || 0;
      }
      await delay(100);
      try {
        tokenAccounts = await limit(() => withRetry(() => getTokenAccounts(pubkey, connection)));
      } catch (e) {
        console.warn('Failed to fetch token accounts:', inspectError(e));
      }
      await delay(100);
      try {
        stakeAccounts = await limit(() => withRetry(() => getStakeAccounts(pubkey, connection)));
      } catch (e) {
        console.warn('Failed to fetch stake accounts:', inspectError(e));
      }

      const nftCount = tokenAccounts.filter(account => account.balance === 1).length;
      const data = {
        netWorth: solBalance * solPrice,
        solBalance,
        solPrice,
        nftCount,
        stakeCount: stakeAccounts.length,
      };

      balanceCache.current[address] = { data, timestamp: Date.now() };
      setBalanceData(data);
    } catch (error: any) {
      console.error('Error fetching balance data:', inspectError(error));
      setSearchError(handleApiError(error, 'Failed to fetch balance data'));
    } finally {
      setBalanceLoading(false);
    }
  }, [lastKnownSolPrice]);

  const fetchPortfolioData = useCallback(async (address: string) => {
    try {
      setLoading(true);
      const connection = new Connection(
        rpcEndpoints[Math.floor(Math.random() * rpcEndpoints.length)],
        { commitment: 'confirmed' }
      );
      const pubkey = new PublicKey(address);

      const [solBalance, tokenAccounts, stakeAccounts] = await Promise.all([
        limit(() => withRetry(() => getSolBalance(pubkey, connection))),
        limit(() => withRetry(() => getTokenAccounts(pubkey, connection))),
        limit(() => withRetry(() => getStakeAccounts(pubkey, connection))),
      ]);

      setTokenAccounts(tokenAccounts);

      const nftCount = tokenAccounts.filter(account => account.balance === 1).length;
      const stakeValue = stakeAccounts.reduce((sum, account) => sum + account.balance, 0);
      const totalValue = solBalance + nftCount + stakeValue;

      setPortfolioBreakdown([
        {
          name: 'SOL',
          value: totalValue > 0 ? Math.round((solBalance / totalValue) * 100) : 0,
          color: '#030303',
          amount: solBalance,
        },
        {
          name: 'NFTs',
          value: totalValue > 0 ? Math.round((nftCount / totalValue) * 100) : 0,
          color: '#1f2837',
          amount: nftCount,
        },
        {
          name: 'Stakes',
          value: totalValue > 0 ? Math.round((stakeValue / totalValue) * 100) : 0,
          color: '#afaeae',
          amount: stakeValue,
        },
      ]);
    } catch (error: any) {
      console.error('Error fetching portfolio data:', inspectError(error));
      setSearchError(handleApiError(error, 'Failed to fetch portfolio data'));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTokenAccounts = useCallback(async (address: string) => {
    try {
      setTokenLoading(true);
      setTokenError(null);
      const connection = new Connection(
        rpcEndpoints[Math.floor(Math.random() * rpcEndpoints.length)],
        { commitment: 'confirmed' }
      );
      const pubkey = new PublicKey(address);
      const accounts = await limit(() => withRetry(() => getTokenAccounts(pubkey, connection)));
      setTokenAccounts(accounts);
    } catch (error: any) {
      console.error('Error fetching token accounts:', inspectError(error));
      setTokenError(handleApiError(error, 'Failed to fetch token accounts'));
    } finally {
      setTokenLoading(false);
    }
  }, []);

  const fetchTxData = useCallback(
    async (address: string, append = false) => {
      try {
        if (!append && transactionCache.current.length === 0) {
          setTxLoading(true);
        }
        setTxError(null);

        const connection = new Connection(
          rpcEndpoints[Math.floor(Math.random() * rpcEndpoints.length)],
          { commitment: 'confirmed' }
        );
        const pubkey = new PublicKey(address);
        const txData = await limit(() =>
          withRetry(() => fetchTransactions(connection, 3, pubkey, append ? beforeSignature : undefined))
        );

        if (txData.length === 0 && !append) {
          setTxError('No transactions found for this address.');
          setTransactions([]);
          return;
        }

        transactionCache.current = append
          ? [...transactionCache.current, ...txData]
          : txData;
        setTransactions(transactionCache.current);
        setBeforeSignature(txData[txData.length - 1]?.signature);
      } catch (error: any) {
        console.error('Error fetching transactions:', inspectError(error));
        setTxError(handleApiError(error, 'Failed to load transactions'));
        if (transactionCache.current.length > 0) {
          setTransactions(transactionCache.current);
        }
      } finally {
        setTxLoading(false);
        initialLoadComplete.current = true;
      }
    },
    [fetchTransactions, beforeSignature]
  );

  // Debounced data fetching
  useEffect(() => {
    if (!searchAddress) return;

    const fetchData = async () => {
      try {
        await Promise.all([
          fetchPortfolioData(searchAddress),
          fetchTokenAccounts(searchAddress),
          fetchTxData(searchAddress),
          fetchBalanceData(searchAddress),
        ]);
      } catch (error: any) {
        console.error('Error fetching data:', inspectError(error));
        setSearchError(handleApiError(error, 'Failed to fetch data'));
      }
    };

    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    fetchTimeoutRef.current = setTimeout(fetchData, 1000);

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [searchAddress, fetchPortfolioData, fetchTokenAccounts, fetchTxData, fetchBalanceData]);

  // Balance cards data
  const balanceCards = [
    {
      title: 'Net Value',
      value: `$${balanceData.netWorth.toFixed(2)}`,
      subtext: `${balanceData.solBalance.toFixed(2)} SOL`,
      icon: DollarSign,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Solana Price',
      value: `$${balanceData.solPrice.toFixed(2)}`,
      subtext: 'Current Price',
      icon: PieChart,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'NFTs',
      value: balanceData.nftCount,
      subtext: 'NFT Holdings',
      icon: Image,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Stake',
      value: balanceData.stakeCount,
      subtext: 'Active Stakes',
      icon: Fuel,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Watch Address</h1>
            <p className="text-gray-500 mt-2">
              {searchAddress
                ? `Viewing address: ${searchAddress.slice(0, 4)}...${searchAddress.slice(-4)}`
                : 'Search any Solana address to view its portfolio'}
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter Solana address..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap"
                  disabled={!searchAddress.trim()}
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={addToWatchlist}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-1"
                  disabled={!searchAddress.trim() || watchlist.includes(searchAddress)}
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </form>
            {watchlist.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-md p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Watchlist</h3>
                <ul className="space-y-2">
                  {watchlist.map((address) => (
                    <li
                      key={address}
                      className="flex justify-between items-center text-sm text-gray-600 hover:bg-gray-50 p-2 rounded"
                    >
                      <button
                        onClick={() => navigate(`/watch?address=${address}`)}
                        className="truncate flex-1 text-left hover:text-blue-500"
                      >
                        {address.slice(0, 4)}...{address.slice(-4)}
                      </button>
                      <button
                        onClick={() => removeFromWatchlist(address)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {searchError && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex justify-between items-center">
          {searchError}
          <button
            onClick={() => {
              fetchBalanceData(searchAddress);
              fetchPortfolioData(searchAddress);
              fetchTokenAccounts(searchAddress);
              fetchTxData(searchAddress);
            }}
            className="ml-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {!searchAddress ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
          <p className="text-gray-500">Enter a Solana address to view its portfolio</p>
        </div>
      ) : (
        <>
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {balanceLoading ? (
              Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-2xl p-6 space-y-2"
                  >
                    <div className="animate-pulse">
                      <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                      <div className="h-6 w-2/3 bg-gray-200 rounded mt-2"></div>
                      <div className="h-3 w-1/2 bg-gray-200 rounded mt-2"></div>
                    </div>
                  </div>
                ))
            ) : (
              balanceCards.map((card, index) => (
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
              ))
            )}
          </div>

          {balanceLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading portfolio data...</p>
            </div>
          )}

          <div className="mb-6 bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Portfolio Distribution</h2>
            {loading ? (
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <div className="space-y-3">
                <MultiColorProgressBar
                  readings={portfolioBreakdown.map((item) => ({
                    name: `${item.name} (${item.amount.toFixed(2)})`,
                    value: item.value,
                    color: item.color,
                  }))}
                />
                <div className="flex flex-wrap gap-4 mt-2">
                  {portfolioBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span>
                        {item.name}: {item.amount.toFixed(2)} ({item.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Activity</h2>
              {txLoading && !initialLoadComplete.current && transactions.length === 0 ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                      <div className="h-3 w-1/2 bg-gray-200 rounded mt-2"></div>
                    </div>
                  ))}
                </div>
              ) : txError ? (
                <div className="text-red-500 p-3 bg-red-50 rounded-lg flex justify-between items-center">
                  <span>{txError}</span>
                  <button
                    onClick={() => fetchTxData(searchAddress)}
                    className="ml-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Retry
                  </button>
                </div>
              ) : transactions.length > 0 ? (
                <div className="overflow-y-auto" style={{ maxHeight: '24rem' }}>
                  <ul className="divide-y divide-gray-200">
                    {transactions.map((tx) => (
                      <li key={tx.signature} className="py-3">
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-gray-900">{tx.message}</div>
                          <div className="text-sm text-gray-500">{tx.date}</div>
                        </div>
                        <div
                          className={`text-sm mt-1 ${
                            tx.status === 'success' ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {tx.status}
                        </div>
                        <a
                          href={`https://solscan.io/tx/${tx.signature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline inline-flex items-center mt-1"
                        >
                          <img
                            src="https://cdn.brandfetch.io/idmJluXsEr/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1737263707630"
                            alt="Solscan"
                            className="w-4 h-4 mr-1 rounded"
                          />
                          View on Solscan
                        </a>
                      </li>
                    ))}
                  </ul>
                  {beforeSignature && (
                    <button
                      onClick={() => fetchTxData(searchAddress, true)}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Load More
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No recent activities found</p>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">Token Accounts</h2>
              {tokenLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between">
                      <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-100 rounded w-1/6 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : tokenError ? (
                <div className="p-3 bg-red-50 rounded-lg text-red-600 text-sm">
                  <div className="flex justify-between items-center">
                    <span>{tokenError}</span>
                    <button
                      onClick={() => fetchTokenAccounts(searchAddress)}
                      className="px-2 py-1 bg-white text-red-600 rounded text-xs border border-red-100 hover:bg-red-100"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : tokenAccounts.length > 0 ? (
                <div className="border border-gray-100 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs text-gray-500 font-medium">
                            Address
                          </th>
                          <th className="px-3 py-2 text-right text-xs text-gray-500 font-medium">
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {tokenAccounts.map((account, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-sm font-mono">
                              {account.address.slice(0, 6)}...{account.address.slice(-4)}
                            </td>
                            <td className="px-3 py-2 text-right text-sm">
                              {account.balance.toFixed(6)} SOL
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-sm text-gray-500">
                  No token accounts found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WatchAddress;
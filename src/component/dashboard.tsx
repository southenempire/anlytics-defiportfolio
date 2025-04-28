import { useEffect, useState, useCallback, useRef } from 'react';
import { Connection } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { Shield, PieChart, Activity, Coins, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { getSolBalance, getTokenAccounts, getStakeAccounts } from './web3plugin/portfolio';
import { useFetchTransactions, SimplifiedTransactionDetail } from './web3plugin/fetchtransaction';
import BalanceCard from './pulgin/balancecard';
import MultiColorProgressBar from './pulgin/progressbar/page';

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

const Dashboard = () => {
    const { publicKey, connected } = useWallet();
    const [portfolioBreakdown, setPortfolioBreakdown] = useState<PortfolioItem[]>([
        { name: 'SOL', value: 0, color: '#ad81ef', amount: 0 },
        { name: 'NFTs', value: 0, color: '#8666ff', amount: 0 },
        { name: 'Stakes', value: 0, color: '#3d7dff', amount: 0 }
    ]);
    const [loading, setLoading] = useState<boolean>(true);
    const [transactions, setTransactions] = useState<SimplifiedTransactionDetail[]>([]);
    const [tokenAccounts, setTokenAccounts] = useState<TokenAccount[]>([]);
    const [txLoading, setTxLoading] = useState<boolean>(false);
    const [txError, setTxError] = useState<string | null>(null);
    const [tokenLoading, setTokenLoading] = useState<boolean>(false);
    const [tokenError, setTokenError] = useState<string | null>(null);
    const initialLoadComplete = useRef(false);
    const transactionCache = useRef<SimplifiedTransactionDetail[]>([]);

    const fetchTransactions = useFetchTransactions();

    const fetchPortfolioData = useCallback(async () => {
        if (!connected || !publicKey) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const connection = new Connection(import.meta.env.VITE_RPC_ENDPOINT);

            const [solBalance, tokenAccounts, stakeAccounts] = await Promise.all([
                getSolBalance(publicKey, connection),
                getTokenAccounts(publicKey, connection),
                getStakeAccounts(publicKey, connection)
            ]);

            setTokenAccounts(tokenAccounts);

            const nftCount = tokenAccounts.filter(account => account.balance === 1).length;
            const stakeValue = stakeAccounts.reduce((sum, account) => sum + account.balance, 0);
            const totalValue = solBalance + nftCount + stakeValue;

            setPortfolioBreakdown([
                {
                    name: 'SOL',
                    value: totalValue > 0 ? Math.round((solBalance / totalValue) * 100) : 0,
                    color: '#ad81ef',
                    amount: solBalance
                },
                {
                    name: 'NFTs',
                    value: totalValue > 0 ? Math.round((nftCount / totalValue) * 100) : 0,
                    color: '#8666ff',
                    amount: nftCount
                },
                {
                    name: 'Stakes',
                    value: totalValue > 0 ? Math.round((stakeValue / totalValue) * 100) : 0,
                    color: '#3d7dff',
                    amount: stakeValue
                }
            ]);
        } catch (error) {
            console.error('Error fetching portfolio data:', error);
        } finally {
            setLoading(false);
        }
    }, [connected, publicKey]);

    const fetchTokenAccounts = useCallback(async () => {
        if (!connected || !publicKey) {
            setTokenAccounts([]);
            return;
        }

        try {
            setTokenLoading(true);
            setTokenError(null);
            const connection = new Connection(import.meta.env.VITE_RPC_ENDPOINT);
            const accounts = await getTokenAccounts(publicKey, connection);
            setTokenAccounts(accounts);
        } catch (error) {
            console.error('Error fetching token accounts:', error);
            setTokenError('Failed to fetch token accounts');
        } finally {
            setTokenLoading(false);
        }
    }, [connected, publicKey]);

    const fetchTxData = useCallback(async () => {
        if (!connected || !publicKey) {
            setTransactions([]);
            return;
        }
    
        try {
            if (transactionCache.current.length === 0) {
                setTxLoading(true);
            }
            setTxError(null);
    
            const connection = new Connection(import.meta.env.VITE_RPC_ENDPOINT);
            const txData = await fetchTransactions(connection, 5, publicKey.toString(), undefined);
    
            transactionCache.current = txData;
            setTransactions(txData);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTxError('Failed to load transactions. You may be rate limited - please try again later.');
    
            if (transactionCache.current.length > 0) {
                setTransactions(transactionCache.current);
            }
        } finally {
            setTxLoading(false);
            initialLoadComplete.current = true;
        }
    }, [connected, publicKey, fetchTransactions]);

    useEffect(() => {
        fetchPortfolioData();
        fetchTokenAccounts();
    }, [fetchPortfolioData, fetchTokenAccounts]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTxData();
        }, 500);

        return () => clearTimeout(timer);
    }, [fetchTxData]);

    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                                Portfolio Dashboard
                            </h1>
                        </div>
                        <p className="text-gray-400 mt-1">Overview of your Solana assets</p>
                    </div>
                    <button 
                        onClick={() => {
                            fetchPortfolioData();
                            fetchTokenAccounts();
                            fetchTxData();
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <RefreshCw size={16} className={loading || txLoading || tokenLoading ? 'animate-spin' : ''} />
                        <span>Refresh</span>
                    </button>
                </div>

                {/* Balance Card */}
                <BalanceCard />

                {/* Portfolio Distribution */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <PieChart className="text-purple-400" size={20} />
                        <h2 className="text-lg font-semibold text-gray-200">Portfolio Distribution</h2>
                    </div>
                    
                    {loading ? (
                        <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                    ) : (
                        <div className="space-y-4">
                            <MultiColorProgressBar
                                readings={portfolioBreakdown.map(item => ({
                                    name: item.name,
                                    value: item.value,
                                    color: item.color
                                }))}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {portfolioBreakdown.map((item, index) => (
                                    <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: item.color }}
                                            ></span>
                                            <span className="font-medium text-gray-200">{item.name}</span>
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            Amount: <span className="text-purple-300">{item.amount.toFixed(2)}</span>
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            Allocation: <span className="text-blue-300">{item.value}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Activity and Token Accounts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <Activity className="text-blue-400" size={20} />
                            <h2 className="text-lg font-semibold text-gray-200">Recent Activity</h2>
                        </div>
                        
                        {txLoading && !initialLoadComplete.current && transactions.length === 0 ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
                                        <div className="h-3 w-1/2 bg-gray-700 rounded mt-2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : txError ? (
                            <div className="bg-red-900/30 border border-red-800 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-red-400 mb-2">
                                    <AlertCircle size={18} />
                                    <h3 className="font-medium">Error</h3>
                                </div>
                                <p className="text-gray-300 text-sm">{txError}</p>
                                <button
                                    onClick={fetchTxData}
                                    className="mt-3 px-3 py-1 bg-red-900/50 hover:bg-red-900/70 rounded text-sm transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : transactions.length > 0 ? (
                            <div className="overflow-y-auto max-h-96">
                                <ul className="divide-y divide-gray-700">
                                    {transactions.map((tx) => (
                                        <li key={tx.signature} className="py-3">
                                            <div className="flex justify-between items-start">
                                                <div className="font-medium text-gray-100">{tx.message}</div>
                                                <div className="text-sm text-gray-400">{tx.date}</div>
                                            </div>
                                            <div className={`text-sm mt-1 flex items-center gap-1 ${
                                                tx.status === 'success' ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                                {tx.status === 'success' ? (
                                                    <CheckCircle size={14} />
                                                ) : (
                                                    <AlertCircle size={14} />
                                                )}
                                                {tx.status}
                                            </div>
                                            <a
                                                href={`https://solscan.io/tx/${tx.signature}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center mt-1"
                                            >
                                                View on Solscan
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-gray-400">No recent activities</p>
                        )}
                    </div>

                    {/* Token Accounts */}
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <Coins className="text-purple-400" size={20} />
                            <h2 className="text-lg font-semibold text-gray-200">Token Accounts</h2>
                        </div>

                        {tokenLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex justify-between">
                                        <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                                        <div className="h-4 bg-gray-700 rounded w-1/6 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        ) : tokenError ? (
                            <div className="bg-red-900/30 border border-red-800 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-red-400 mb-2">
                                    <AlertCircle size={18} />
                                    <h3 className="font-medium">Error</h3>
                                </div>
                                <p className="text-gray-300 text-sm">{tokenError}</p>
                                <button
                                    onClick={fetchTokenAccounts}
                                    className="mt-3 px-3 py-1 bg-red-900/50 hover:bg-red-900/70 rounded text-sm transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : tokenAccounts.length > 0 ? (
                            <div className="border border-gray-700 rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-700">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs text-gray-300 font-medium">Address</th>
                                                <th className="px-4 py-2 text-right text-xs text-gray-300 font-medium">Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700">
                                            {tokenAccounts.map((account, index) => (
                                                <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                                                    <td className="px-4 py-2 text-sm font-mono text-gray-300">
                                                        {account.address.slice(0, 6)}...{account.address.slice(-4)}
                                                    </td>
                                                    <td className="px-4 py-2 text-right text-sm text-gray-300">
                                                        {account.balance.toFixed(6)} SOL
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4 text-sm text-gray-400">
                                No token accounts found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
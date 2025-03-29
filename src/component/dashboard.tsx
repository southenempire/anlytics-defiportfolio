import { useEffect, useState, useCallback, useRef } from 'react';
import { Connection } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
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
        { name: 'SOL', value: 0, color: '#030303', amount: 0 },
        { name: 'NFTs', value: 0, color: '#1f2837', amount: 0 },
        { name: 'Stakes', value: 0, color: '#afaeae', amount: 0 }
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

            // Update token accounts state
            setTokenAccounts(tokenAccounts);

            const nftCount = tokenAccounts.filter(account => account.balance === 1).length;
            const stakeValue = stakeAccounts.reduce((sum, account) => sum + account.balance, 0);
            const totalValue = solBalance + nftCount + stakeValue;

            setPortfolioBreakdown([
                {
                    name: 'SOL',
                    value: totalValue > 0 ? Math.round((solBalance / totalValue) * 100) : 0,
                    color: '#030303',
                    amount: solBalance
                },
                {
                    name: 'NFTs',
                    value: totalValue > 0 ? Math.round((nftCount / totalValue) * 100) : 0,
                    color: '#1f2837',
                    amount: nftCount
                },
                {
                    name: 'Stakes',
                    value: totalValue > 0 ? Math.round((stakeValue / totalValue) * 100) : 0,
                    color: '#afaeae',
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
            const txData = await fetchTransactions(connection, 5);

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
        <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500 mt-2">Overview of your account</p>
            </div>

            <BalanceCard />

            <div className="mb-6 bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Portfolio Distribution</h2>
                {loading ? (
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                    <div className="space-y-3">
                        <MultiColorProgressBar
                            readings={portfolioBreakdown.map(item => ({
                                name: `${item.name} (${item.amount.toFixed(2)})`,
                                value: item.value,
                                color: item.color
                            }))}
                        />
                        <div className="flex flex-wrap gap-4 mt-2">
                            {portfolioBreakdown.map((item, index) => (
                                <div key={index} className="flex items-center text-sm">
                                    <span
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: item.color }}
                                    ></span>
                                    <span>{item.name}: {item.amount.toFixed(2)} ({item.value}%)</span>
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
                        <div className="text-red-500 p-3 bg-red-50 rounded-lg">
                            {txError}
                            <button
                                onClick={fetchTxData}
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
                                        <div className={`text-sm mt-1 ${tx.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
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
                        </div>
                    ) : (
                        <p className="text-gray-500">No recent activities</p>
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
                                    onClick={fetchTokenAccounts}
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
                                            <th className="px-3 py-2 text-left text-xs text-gray-500 font-medium">Address</th>
                                            <th className="px-3 py-2 text-right text-xs text-gray-500 font-medium">Balance</th>
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
        </div>
    );
};

export default Dashboard;
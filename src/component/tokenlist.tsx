import React from 'react';
import BalanceCard from './pulgin/balancecard';
import TokenCardTable from './pulgin/tokentable';
import SolanaTokenMetadata from './solanatokenmetadata/page';

function Tradetoken() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">PumpFun</h1>
                <p className="text-gray-500 mt-2">Trade Latest pumpfun token</p>
            </div>
            
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <BalanceCard />
                </div>
                <div>
                    <SolanaTokenMetadata/>
                </div>
                <div>
                    <TokenCardTable />
                </div>
            </div>
        </div>
    );
}

export default Tradetoken;
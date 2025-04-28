// src/components/MetadataDisplay.tsx
import { BubblemapsTokenMetadata } from '../../../types/bubblemap';
import { PieChart } from 'lucide-react';

interface MetadataDisplayProps {
  metadata: BubblemapsTokenMetadata;
}

const MetadataDisplay = ({ metadata }: MetadataDisplayProps) => {
  return (
    <div className="mt-6 text-gray-100">
      <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
        Token Distribution
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Decentralization Score */}
        <div className="bg-gray-800 rounded-2xl p-5">
          <div className="flex items-center mb-4">
            <PieChart className="text-blue-400 mr-2" size={20} />
            <span className="font-medium text-gray-300">Decentralization Score</span>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold text-white mr-2">
              {metadata.decentralisation_score.toFixed(1)}
            </span>
            <span className="text-gray-400 text-sm mb-1">/100</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${metadata.decentralisation_score}%` }}
            ></div>
          </div>
        </div>

        {/* Supply Distribution */}
        <div className="bg-gray-800 rounded-2xl p-5">
          <h3 className="font-medium text-gray-300 mb-4">Identified Supply</h3>
          <div className="space-y-4">
            {/* In CEXs */}
            <div>
              <div className="flex justify-between text-sm mb-2 text-gray-400">
                <span>In CEXs</span>
                <span>{metadata.identified_supply.percent_in_cexs}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${metadata.identified_supply.percent_in_cexs}%` }}
                ></div>
              </div>
            </div>

            {/* In Contracts */}
            <div>
              <div className="flex justify-between text-sm mb-2 text-gray-400">
                <span>In Contracts</span>
                <span>{metadata.identified_supply.percent_in_contracts}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${metadata.identified_supply.percent_in_contracts}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-500">
        Last updated: {new Date(metadata.dt_update).toLocaleString()}
      </div>
    </div>
  );
};

export default MetadataDisplay;

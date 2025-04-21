// src/components/MetadataDisplay.tsx
import { BubblemapsTokenMetadata } from '../../../types/bubblemap';
import { PieChart } from 'lucide-react';

interface MetadataDisplayProps {
  metadata: BubblemapsTokenMetadata;
}

const MetadataDisplay = ({ metadata }: MetadataDisplayProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Token Distribution</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Decentralization Score */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <PieChart className="mr-2 text-blue-500" size={18} />
            <span className="font-medium">Decentralization Score</span>
          </div>
          <div className="flex items-end">
            <span className="text-2xl font-bold mr-2">
              {metadata.decentralisation_score.toFixed(1)}
            </span>
            <span className="text-gray-500 text-sm mb-1">/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${metadata.decentralisation_score}%` }}
            ></div>
          </div>
        </div>

        {/* Supply Distribution */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-medium mb-3">Identified Supply</h3>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>In CEXs</span>
                <span>{metadata.identified_supply.percent_in_cexs}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${metadata.identified_supply.percent_in_cexs}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>In Contracts</span>
                <span>{metadata.identified_supply.percent_in_contracts}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${metadata.identified_supply.percent_in_contracts}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Last updated: {new Date(metadata.dt_update).toLocaleString()}
      </div>
    </div>
  );
};

export default MetadataDisplay;
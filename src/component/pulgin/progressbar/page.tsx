import React from 'react';
import { PieChart } from 'lucide-react';

interface Reading {
  name: string;
  value: number;
  color: string;
}

interface MultiColorProgressBarProps {
  readings: Reading[];
}

const MultiColorProgressBar: React.FC<MultiColorProgressBarProps> = ({ readings }) => {
  const filteredReadings = readings.filter((item: Reading) => item.value > 0);
  const totalPercentage = filteredReadings.reduce((sum: number, item: Reading) => sum + item.value, 0);
  
  const normalizedReadings = filteredReadings.map((item: Reading) => ({
    ...item,
    normalizedValue: (item.value / totalPercentage) * 100
  }));

  return (
    <div className="w-full bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
      <div className="mb-4 flex items-center gap-2">
        <PieChart className="text-purple-400" size={20} />
        <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          Portfolio Breakdown
        </h3>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-4">
        <div className="flex h-full">
          {normalizedReadings.map((item, index) => (
            <div
              key={index}
              className="h-full transition-all duration-500 ease-out"
              style={{
                width: `${item.normalizedValue}%`,
                backgroundColor: item.color
              }}
            />
          ))}
        </div>
      </div>

      {/* Legends */}
      <div className="flex flex-wrap gap-4">
        {normalizedReadings.map((item, index) => (
          <div key={index} className="flex items-center">
            <span 
              className="inline-block w-3 h-3 mr-2 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-300">
              {item.name} <span className="text-purple-400 font-medium">{item.value}%</span>
            </span>
          </div>
        ))}
      </div>

      {totalPercentage < 100 && (
        <div className="mt-3 text-xs text-gray-500 flex items-center">
          <span className="inline-block w-3 h-3 mr-2 rounded-full bg-gray-700" />
          Unallocated: {(100 - totalPercentage).toFixed(1)}%
        </div>
      )}
    </div>
  );
};

export default MultiColorProgressBar;
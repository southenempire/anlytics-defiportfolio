import React from 'react';

// Define the type for each reading
interface Reading {
  name: string;
  value: number;
  color: string;
}

// Define props type
interface MultiColorProgressBarProps {
  readings: Reading[];
}

const MultiColorProgressBar: React.FC<MultiColorProgressBarProps> = ({ readings }) => {
  // Filter out readings with zero value
  const filteredReadings = readings.filter((item: Reading) => item.value > 0);

  // Calculate total percentage to ensure it doesn't exceed 100%
  const totalPercentage = filteredReadings.reduce((sum: number, item: Reading) => sum + item.value, 0);
  
  const normalizedReadings = filteredReadings.map((item: Reading) => ({
    ...item,
    normalizedValue: (item.value / totalPercentage) * 100
  }));

  return (
    <div className="w-full bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-700">Portfolio Breakdown</h3>
      </div>
      
      {/* Sleek Progress Bar */}
      <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div className="flex h-full">
          {normalizedReadings.map((item: Reading & { normalizedValue: number }, index: number) => (
            <div
              key={index}
              className="h-full"
              style={{
                width: `${item.normalizedValue}%`,
                backgroundColor: item.color
              }}
            />
          ))}
        </div>
      </div>

      {/* Compact Legends */}
      <div className="flex flex-wrap justify-center gap-3">
        {normalizedReadings.map((item: Reading, index: number) => (
          <div key={index} className="flex items-center">
            <span 
              className="inline-block w-2.5 h-2.5 mr-1.5 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-600">
              {item.name} ({item.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiColorProgressBar;
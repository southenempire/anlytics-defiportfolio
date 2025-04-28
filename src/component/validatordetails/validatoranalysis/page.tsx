import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, ArrowDown, ArrowUp, TrendingUp } from 'lucide-react';
import { fetchValidatorTransfers } from './validatoranalysis';

interface TransferData {
  date: string;
  transferIn: number;
  transferOut: number;
  netFlow: number;
}

const ValidatorAnalytics = () => {
  const { nodePubkey } = useParams<{ nodePubkey: string }>();
  const [transferData, setTransferData] = useState<TransferData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!nodePubkey) return;
      
      try {
        const data = await fetchValidatorTransfers(nodePubkey);
        setTransferData(data);
      } catch (error) {
        console.error("Failed to fetch transfer data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [nodePubkey]);

  if (loading) {
    return (
      <div className="bg-gray-700/30 rounded-lg border border-gray-700 p-6 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="h-64 bg-gray-700 rounded mb-6"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const formatSolValue = (value: number) => value.toFixed(2);

  return (
    <div className="bg-gray-700/30 rounded-xl border border-gray-700 p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="text-purple-500" size={24} />
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          Daily Value Transfers
        </h2>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={transferData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatSolValue(value)}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                borderColor: '#4B5563',
                borderRadius: '0.5rem',
              }}
              formatter={(value) => [`${value} SOL`, '']}
              labelStyle={{ color: '#E5E7EB' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Line 
              type="monotone" 
              dataKey="transferIn" 
              stroke="#34d399" 
              name="Transfer In" 
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="transferOut" 
              stroke="#f87171" 
              name="Transfer Out" 
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="netFlow" 
              stroke="#60a5fa" 
              name="Net Flow" 
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Inflow" 
          value={transferData.reduce((sum, day) => sum + day.transferIn, 0)} 
          unit="SOL"
          icon={<ArrowUp className="text-green-400" size={18} />}
          trend="positive"
        />
        <StatCard 
          title="Total Outflow" 
          value={transferData.reduce((sum, day) => sum + day.transferOut, 0)} 
          unit="SOL"
          icon={<ArrowDown className="text-red-400" size={18} />}
          trend="negative"
        />
        <StatCard 
          title="Net Flow" 
          value={transferData.reduce((sum, day) => sum + day.netFlow, 0)} 
          unit="SOL"
          icon={<TrendingUp className="text-blue-400" size={18} />}
          trend={transferData.reduce((sum, day) => sum + day.netFlow, 0) >= 0 ? "positive" : "negative"}
        />
      </div>
    </div>
  );
};

const StatCard = ({ 
  title, 
  value, 
  unit, 
  icon,
  trend 
}: { 
  title: string; 
  value: number; 
  unit: string; 
  icon: React.ReactNode;
  trend: "positive" | "negative";
}) => (
  <div className={`p-4 rounded-lg border ${trend === 'positive' ? 'border-green-800/50' : 'border-red-800/50'} bg-gray-700/20`}>
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <p className="text-2xl font-semibold text-gray-100 mt-1">
          {value.toFixed(2)} <span className="text-sm text-gray-400">{unit}</span>
        </p>
      </div>
      <div className={`p-2 rounded-lg ${trend === 'positive' ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
        {icon}
      </div>
    </div>
  </div>
);

export default ValidatorAnalytics;
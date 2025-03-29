// components/ValidatorAnalytics.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

  if (loading) return <div>Loading analytics...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Daily Value Transfers</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={transferData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} SOL`, '']} />
            <Legend />
            <Line type="monotone" dataKey="transferIn" stroke="#4ade80" name="Transfer In" />
            <Line type="monotone" dataKey="transferOut" stroke="#f87171" name="Transfer Out" />
            <Line type="monotone" dataKey="netFlow" stroke="#60a5fa" name="Net Flow" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4">
        <StatCard 
          title="Total Inflow" 
          value={transferData.reduce((sum, day) => sum + day.transferIn, 0)} 
          unit="SOL"
          color="green"
        />
        <StatCard 
          title="Total Outflow" 
          value={transferData.reduce((sum, day) => sum + day.transferOut, 0)} 
          unit="SOL"
          color="red"
        />
        <StatCard 
          title="Net Flow" 
          value={transferData.reduce((sum, day) => sum + day.netFlow, 0)} 
          unit="SOL"
          color="blue"
        />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, unit, color }: { title: string; value: number; unit: string; color: string }) => (
  <div className={`p-4 border-l-4 border-${color}-500 bg-${color}-50 rounded`}>
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="text-2xl font-semibold">
      {value.toFixed(2)} <span className="text-sm">{unit}</span>
    </p>
  </div>
);

export default ValidatorAnalytics;
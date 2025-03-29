import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSolanaValidators } from './web3plugin/validators';
import { FaCopy, FaCheck } from 'react-icons/fa';

interface Validator {
  votePubkey: string;
  nodePubkey: string;
  activatedStake: number;
  commission: number;
  lastVote: number;
  epochVoteAccount: boolean;
  name?: string;
  website?: string;
  delinquent?: boolean;
  apyEstimate?: number;
}

const ValidatorsList = () => {
  const [validators, setValidators] = useState<Validator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchValidators = async () => {
      try {
        setLoading(true);
        const data = await fetchSolanaValidators(12);
        setValidators(data);
      } catch (err) {
        setError('Failed to fetch validator data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchValidators();
  }, []);

  const formatStake = (lamports: number) => {
    return (lamports / 10 ** 9).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getStatusColor = (delinquent?: boolean) => {
    return delinquent ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  };

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleValidatorClick = (validator: Validator) => {
    navigate(`/validator/${encodeURIComponent(validator.nodePubkey)}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        {error}
        <button 
          onClick={() => window.location.reload()}
          className="ml-2 px-3 py-1 bg-red-100 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Top Solana Validators</h2>
        <p className="text-gray-600 mt-2">Sorted by stake amount</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {validators.map((validator, index) => (
          <div 
            key={validator.nodePubkey} 
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => handleValidatorClick(validator)}
          >
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {validator.name || 'Validator'}
                    </h3>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-gray-500 font-mono">
                        {validator.nodePubkey.slice(0, 4)}...{validator.nodePubkey.slice(-4)}
                      </p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(validator.nodePubkey);
                        }}
                        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy address"
                      >
                        {copiedAddress === validator.nodePubkey ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaCopy />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full ${getStatusColor(validator.delinquent)}`}>
                  {validator.delinquent ? 'Delinquent' : 'Active'}
                </span>
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Stake</span>
                  <span className="font-semibold text-gray-900">{formatStake(validator.activatedStake)} SOL</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Commission</span>
                  <span className="font-semibold text-gray-900">{validator.commission}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Est. APY</span>
                  <span className="font-semibold text-gray-900">
                    {validator.apyEstimate ? `${validator.apyEstimate.toFixed(2)}%` : 'N/A'}
                  </span>
                </div>
              </div>

              {validator.website && (
                <div className="pt-4">
                  <a 
                    href={validator.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="truncate">{validator.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Data updates every 5 minutes • Last updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default ValidatorsList;
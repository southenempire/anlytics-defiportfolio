import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSolanaValidators } from './web3plugin/validators';
import { Shield, Copy, Check, ExternalLink, ArrowRight } from 'lucide-react';

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
    return delinquent 
      ? 'bg-red-900/30 text-red-400 border-red-800' 
      : 'bg-green-900/30 text-green-400 border-green-800';
  };

  const copyToClipboard = (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleValidatorClick = (validator: Validator) => {
    navigate(`/validator/${encodeURIComponent(validator.nodePubkey)}`);
  };

  if (loading) {
    return (
      <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="text-purple-500" size={24} />
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Loading Validators...
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-xl border border-gray-700 p-6 animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Top Solana Validators
            </h2>
          </div>
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-300">
            <h3 className="font-bold mb-2">Error Loading Validators</h3>
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-800/50 rounded hover:bg-red-800 text-sm border border-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Top Solana Validators
          </h2>
        </div>
        <p className="text-gray-400 mb-8">Sorted by stake amount</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {validators.map((validator, index) => (
            <div 
              key={validator.nodePubkey} 
              className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-purple-500 transition-all duration-200 cursor-pointer group"
              onClick={() => handleValidatorClick(validator)}
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-900/30 flex items-center justify-center border border-purple-800">
                      <span className="text-purple-400 font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-100 group-hover:text-purple-300 transition-colors">
                        {validator.name || 'Validator'}
                      </h3>
                      <div className="flex items-center mt-1">
                        <p className="text-sm text-gray-400 font-mono">
                          {validator.nodePubkey.slice(0, 4)}...{validator.nodePubkey.slice(-4)}
                        </p>
                        <button 
                          onClick={(e) => copyToClipboard(validator.nodePubkey, e)}
                          className="ml-2 text-gray-500 hover:text-purple-400 transition-colors"
                          title="Copy address"
                        >
                          {copiedAddress === validator.nodePubkey ? (
                            <Check className="text-green-400" size={16} />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${getStatusColor(validator.delinquent)}`}>
                    {validator.delinquent ? 'Delinquent' : 'Active'}
                  </span>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span className="text-sm font-medium text-gray-400">Stake</span>
                    <span className="font-semibold text-gray-100">{formatStake(validator.activatedStake)} SOL</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span className="text-sm font-medium text-gray-400">Commission</span>
                    <span className="font-semibold text-gray-100">{validator.commission}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-400">Est. APY</span>
                    <span className="font-semibold text-gray-100">
                      {validator.apyEstimate ? `${validator.apyEstimate.toFixed(2)}%` : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  {validator.website && (
                    <a 
                      href={validator.website.startsWith('http') ? validator.website : `https://${validator.website}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} />
                      <span className="truncate max-w-[120px]">
                        {validator.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                      </span>
                    </a>
                  )}
                  <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                    <span className="text-xs">View details</span>
                    <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-xs text-gray-500 border-t border-gray-800 pt-6">
          <p>Data updates every 5 minutes • Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ValidatorsList;
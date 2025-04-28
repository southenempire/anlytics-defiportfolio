import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchValidatorDetails } from '../web3plugin/validators';
import { Shield, ArrowLeft, Copy, Check, ExternalLink, Key } from 'lucide-react';
import { Validator } from '../web3plugin/validators';
import ValidatorAnalytics from './validatoranalysis/page';

const ValidatorDetails = () => {
  const { nodePubkey } = useParams<{ nodePubkey: string }>();
  const navigate = useNavigate();
  const [validator, setValidator] = useState<Validator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!nodePubkey) {
        setError('Validator address is missing');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const data = await fetchValidatorDetails(nodePubkey);
        setValidator(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(
          err instanceof Error 
            ? err.message 
            : 'Failed to load validator details. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [nodePubkey]);

  const formatStake = (lamports: number) => {
    return (lamports / 10 ** 9).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatPercentage = (value: number) => {
    return value.toFixed(2) + '%';
  };

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const getStatusColor = (delinquent?: boolean) => {
    return delinquent 
      ? 'bg-red-900/30 text-red-400 border-red-800' 
      : 'bg-green-900/30 text-green-400 border-green-800';
  };

  if (loading) {
    return (
      <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-purple-500" size={24} />
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Validator Details
            </h2>
          </div>
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/2 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-purple-400 hover:text-purple-300 mb-6"
          >
            <ArrowLeft className="mr-2" size={18} /> Back to Validators
          </button>
          
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-300">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Shield className="text-red-400" size={18} />
              Error Loading Validator
            </h3>
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

  if (!validator) {
    return (
      <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-purple-400 hover:text-purple-300 mb-6"
          >
            <ArrowLeft className="mr-2" size={18} /> Back to Validators
          </button>
          
          <div className="bg-gray-700/30 rounded-lg border border-gray-600 p-6 text-center">
            <p className="text-gray-400 mb-4">Validator not found</p>
            <button 
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 border border-gray-600"
            >
              Return to Validator List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-purple-400 hover:text-purple-300"
          >
            <ArrowLeft className="mr-2" size={18} /> Back to Validators
          </button>
          
          <div className="flex items-center gap-3">
            <Shield className="text-purple-500" size={24} />
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Validator Details
            </h2>
          </div>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        <div className="bg-gray-700/30 rounded-xl border border-gray-700 overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-100">
                  {validator.name || 'Unknown Validator'}
                </h1>
                
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="flex items-center bg-gray-700/50 px-3 py-1 rounded-lg">
                    <span className="text-sm text-gray-300 font-mono break-all">
                      {validator.nodePubkey.slice(0, 8)}...{validator.nodePubkey.slice(-8)}
                    </span>
                    <button 
                      onClick={() => copyToClipboard(validator.nodePubkey)}
                      className="ml-2 text-gray-400 hover:text-purple-400 transition-colors"
                      title="Copy address"
                    >
                      {copiedAddress === validator.nodePubkey ? (
                        <Check className="text-green-400" size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                  
                  <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(validator.delinquent)}`}>
                    {validator.delinquent ? 'Delinquent' : 'Active'}
                  </span>
                </div>
              </div>
              
              {(validator.website || validator.keybaseUsername) && (
                <div className="flex flex-wrap gap-3">
                  {validator.website && (
                    <a
                      href={validator.website.startsWith('http') ? validator.website : `https://${validator.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-purple-400 hover:text-purple-300 bg-gray-700/50 hover:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-600"
                    >
                      <ExternalLink className="mr-2" size={16} /> Website
                    </a>
                  )}
                  {validator.keybaseUsername && (
                    <a
                      href={`https://keybase.io/${validator.keybaseUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-purple-400 hover:text-purple-300 bg-gray-700/50 hover:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-600"
                    >
                      <Key className="mr-2" size={16} /> Keybase
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="font-semibold text-lg text-gray-100 border-b border-gray-700 pb-2">
                  Staking Information
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span className="text-sm font-medium text-gray-400">Total Stake</span>
                    <span className="font-semibold text-gray-100">
                      {formatStake(validator.activatedStake)} SOL
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span className="text-sm font-medium text-gray-400">Commission Rate</span>
                    <span className="font-semibold text-gray-100">
                      {formatPercentage(validator.commission)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span className="text-sm font-medium text-gray-400">Estimated APY</span>
                    <span className="font-semibold text-gray-100">
                      {validator.apyEstimate ? formatPercentage(validator.apyEstimate) : 'N/A'}
                    </span>
                  </div>
                  {validator.uptime && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-400">Uptime</span>
                      <span className="font-semibold text-gray-100">
                        {formatPercentage(validator.uptime)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="font-semibold text-lg text-gray-100 border-b border-gray-700 pb-2">
                  Validator Details
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span className="text-sm font-medium text-gray-400">Vote Account</span>
                    <div className="flex items-center bg-gray-700/50 px-2 py-1 rounded">
                      <span className="font-mono text-sm text-gray-300">
                        {validator.votePubkey.slice(0, 8)}...{validator.votePubkey.slice(-8)}
                      </span>
                      <button 
                        onClick={() => copyToClipboard(validator.votePubkey)}
                        className="ml-2 text-gray-400 hover:text-purple-400 transition-colors"
                        title="Copy address"
                      >
                        {copiedAddress === validator.votePubkey ? (
                          <Check className="text-green-400" size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span className="text-sm font-medium text-gray-400">Last Vote</span>
                    <span className="font-semibold text-gray-100">
                      {validator.lastVote.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span className="text-sm font-medium text-gray-400">Epoch Vote Account</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      validator.epochVoteAccount 
                        ? 'bg-green-900/30 text-green-400' 
                        : 'bg-red-900/30 text-red-400'
                    }`}>
                      {validator.epochVoteAccount ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {validator.score && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-400">Score/Rating</span>
                      <span className="font-semibold text-gray-100">
                        {validator.score.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ValidatorAnalytics />
      </div>
    </div>
  );
};

export default ValidatorDetails;
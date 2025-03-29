import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchValidatorDetails } from '../web3plugin/validators';
import { FaCopy, FaCheck, FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import { SiKeybase } from 'react-icons/si';
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
      ? 'bg-red-100 text-red-800' 
      : 'bg-green-100 text-green-800';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Validators
        </button>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <h3 className="font-bold mb-2">Error Loading Validator</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-100 rounded hover:bg-red-200 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!validator) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Validators
        </button>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <p className="text-gray-600 mb-4">Validator not found</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            Return to Validator List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800"
      >
        <FaArrowLeft className="mr-2" /> Back to Validators
      </button>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {validator.name || 'Unknown Validator'}
              </h1>
              
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 font-mono break-all">
                    {validator.nodePubkey}
                  </span>
                  <button 
                    onClick={() => copyToClipboard(validator.nodePubkey)}
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
                
                <span className={`text-xs px-2.5 py-1 rounded-full ${getStatusColor(validator.delinquent)}`}>
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
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <FaExternalLinkAlt className="mr-1" /> Website
                  </a>
                )}
                {validator.keybaseUsername && (
                  <a
                    href={`https://keybase.io/${validator.keybaseUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <SiKeybase className="mr-1" /> Keybase
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="font-semibold text-lg text-gray-900 border-b pb-2">
                Staking Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Total Stake</span>
                  <span className="font-semibold text-gray-900">
                    {formatStake(validator.activatedStake)} SOL
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Commission Rate</span>
                  <span className="font-semibold text-gray-900">
                    {formatPercentage(validator.commission)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Estimated APY</span>
                  <span className="font-semibold text-gray-900">
                    {validator.apyEstimate ? formatPercentage(validator.apyEstimate) : 'N/A'}
                  </span>
                </div>
                {validator.uptime && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Uptime</span>
                    <span className="font-semibold text-gray-900">
                      {formatPercentage(validator.uptime)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-semibold text-lg text-gray-900 border-b pb-2">
                Validator Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Vote Account</span>
                  <div className="flex items-center">
                    <span className="font-mono text-sm text-gray-900">
                      {validator.votePubkey.slice(0, 8)}...{validator.votePubkey.slice(-8)}
                    </span>
                    <button 
                      onClick={() => copyToClipboard(validator.votePubkey)}
                      className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy address"
                    >
                      {copiedAddress === validator.votePubkey ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaCopy />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Last Vote</span>
                  <span className="font-semibold text-gray-900">
                    {validator.lastVote.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Epoch Vote Account</span>
                  <span className="font-semibold text-gray-900">
                    {validator.epochVoteAccount ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {validator.score && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Score/Rating</span>
                    <span className="font-semibold text-gray-900">
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
  );
};

export default ValidatorDetails;
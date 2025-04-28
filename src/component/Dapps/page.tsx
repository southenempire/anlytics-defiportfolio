import React, { useState } from 'react';
import { Shield, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const UrlVerifier = () => {
  const [urlInput, setUrlInput] = useState('');
  const [result, setResult] = useState<any>(null); // Using any type to fix the TypeScript error
  const [error, setError] = useState<string | null>(null); // Fix for TypeScript error
  const [loading, setLoading] = useState(false);

  const verifyUrl = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
  
    try {
      if (!urlInput) {
        throw new Error('Please enter a URL');
      }
  
      const backendUrl = 'http://localhost:3000/verifyurl';
      const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: urlInput }),
      };
  
      const response = await fetch(backendUrl, options);
      const text = await response.text();
      
      try {
        const json = text ? JSON.parse(text) : {};
        if (!response.ok) {
          throw new Error(json.error || `HTTP error! Status: ${response.status}`);
        }
        setResult(json);
      } catch (parseError) {
        throw new Error(`Invalid JSON: ${text}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) {
      setError('Please enter a URL');
      return;
    }
    verifyUrl();
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
      <div className="max-w-md mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="text-purple-500" size={24} />
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            DeFi URL Verifier
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter dApp URL (e.g., https://raydium.io)"
              className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded-lg py-3 px-4 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
              loading 
                ? 'bg-gray-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader size={18} className="animate-spin" />
                <span>Verifying...</span>
              </div>
            ) : (
              'Verify URL'
            )}
          </button>
        </form>

        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle size={18} />
              <p className="font-medium">Error</p>
            </div>
            <p className="mt-1 text-sm text-red-300">{error}</p>
          </div>
        )}

        {result && (
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gray-700 px-4 py-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-400" />
              <h3 className="font-medium text-gray-200">Verification Result</h3>
            </div>
            <div className="p-4 bg-gray-700/50 text-xs font-mono text-gray-300 overflow-auto max-h-60">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-xs text-purple-400 text-opacity-70">
            Powered by webcacy
          </p>
        </div>
      </div>
    </div>
  );
};

export default UrlVerifier;
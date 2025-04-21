// src/hooks/useTokenMetadata.ts
import { useState, useEffect } from 'react';
import { fetchTokenMetadata } from '../component/web3plugin/bubblemapsapi';
import { BubblemapsTokenMetadata } from '../types/bubblemap';

export const useTokenMetadata = (tokenAddress: string | null) => {
  const [metadata, setMetadata] = useState<BubblemapsTokenMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tokenAddress) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchTokenMetadata(tokenAddress);
        setMetadata(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tokenAddress]);

  return { metadata, loading, error };
};
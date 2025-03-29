
interface PumpFunToken {
  tokenAddress: string;
  name: string;
  symbol: string;
  logo: string;
  decimals: string;
  priceNative: string;
  priceUsd: string;
  liquidity: string;
  fullyDilutedValuation: string;
  createdAt: string;
}

interface PumpFunResponse {
  result: PumpFunToken[];
  cursor: string;
}

const PUMPFUN_API_URL = 'https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/new';

/**
 * Type guard for PumpFunResponse
 */
function isPumpFunResponse(data: unknown): data is PumpFunResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'result' in data &&
    Array.isArray(data.result) &&
    'cursor' in data &&
    typeof data.cursor === 'string'
  );
}

/**
 * Gets the API key from environment variables
 * @throws Error if API key is not defined
 */
function getApiKey(): string {
  // Use Vite environment variable in production
  const apiKey = import.meta.env.VITE_MORALIS_API || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjI4ZjdlNzM2LTg4Y2QtNGVmMS04MTdiLWJkOTNmZmZiYzlhMCIsIm9yZ0lkIjoiMjA3MjU1IiwidXNlcklkIjoiMjA2OTI3IiwidHlwZUlkIjoiMzg3Y2NhMmItZGM2ZC00NjU0LTljNGUtM2JjYjYzNmY1NjI5IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MzgzNjM2OTAsImV4cCI6NDg5NDEyMzY5MH0.DdmO41tfgrH6FiCEuUkyJOoUFPRQD9vlaUhrmIXAVnQ';
  if (!apiKey) {
    throw new Error('Moralis API key environment variable is not defined. Please set VITE_MORALIS_API');
  }
  return apiKey;
}

/**
 * Fetches new tokens from Pump.fun
 * @param limit Number of tokens to fetch (max 100)
 * @returns Promise with array of PumpFunToken
 * @throws Error if API request fails or response is invalid
 */
export async function fetchNewPumpFunTokens(limit: number = 100): Promise<PumpFunToken[]> {
  try {
    if (limit > 100) {
      console.warn('Maximum limit is 100. Using limit=100');
      limit = 10;
    }

    const apiKey = getApiKey();
    const response = await window.fetch(`${PUMPFUN_API_URL}?limit=${limit}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'X-API-Key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!isPumpFunResponse(data)) {
      throw new Error('Invalid API response structure');
    }

    return data.result;
  } catch (error) {
    console.error('Error fetching Pump.fun tokens:', error);
    throw error;
  }
}

// Example usage with proper error handling (for testing)
// Remove this in production or wrap in development-only check
if (import.meta.env.MODE === 'development') {
  (async () => {
    try {
      const newTokens = await fetchNewPumpFunTokens(20);
      console.log('New Pump.fun Tokens:');
      console.table(newTokens.map(token => ({
        Symbol: token.symbol || 'null',
        Name: token.name || 'null',
        Logo: token.logo ? '🖼️' : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMuEk2crxx1x5z5OppCdwEVc2mwJnm7PIL6g&s',
        Address: `${token.tokenAddress.substring(0, 4)}...${token.tokenAddress.substring(token.tokenAddress.length - 4)}`,
        'Price (SOL)': token.priceNative,
        'Price (USD)': token.priceUsd,
        'Liquidity': `$${parseFloat(token.liquidity).toLocaleString()}`,
        'FDV': token.fullyDilutedValuation ? `$${token.fullyDilutedValuation}` : '$null',
        'Created': token.createdAt
      })));
      
      // Display logos for tokens that have them
      console.log('\nLogos available for:');
      newTokens.filter(t => t.logo).forEach(token => {
        console.log(`${token.symbol || 'Unnamed token'}: ${token.logo}`);
      });
    } catch (error) {
      console.error('Failed to fetch tokens:', error instanceof Error ? error.message : 'Unknown error');
      // Don't use process.exit() in browser environment
    }
  })();
}
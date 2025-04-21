// Define types for Moralis API response
export interface TokenHolderDistribution {
    totalHolders: number;
    holdersByAcquisition: {
      swap: number;
      transfer: number;
      airdrop: number;
    };
    holderChange: {
      [period: string]: {
        change: number;
        changePercent: number;
      };
    };
    holderDistribution: {
      whales: number;
      sharks: number;
      dolphins: number;
      fish: number;
      octopus: number;
      crabs: number;
      shrimps: number;
    };
  }
  
  // Type for token holder displayed in UI
  export interface TokenHolder {
    address: string;
    amount: number;
    percentage: number;
  }
  
  const MORALIS_API_KEY = import.meta.env.VITE_MORALIS_API;

  if (!MORALIS_API_KEY) {
    throw new Error("VITE_MORALIS_API environment variable is not defined");
  }
  
  // Helper for fetching that works in both browser and Node.js environments
  const customFetch = async (url: string, options: RequestInit) => {
    try {
      // Use browser's native fetch
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };
  
  // Simulated distribution data for fallback
  const simulateDistributionData = (_tokenAddress: string): TokenHolderDistribution => {
    return {
      totalHolders: 647639,
      holdersByAcquisition: {
        swap: 475836,
        transfer: 156565,
        airdrop: 15238
      },
      holderChange: {
        "5min": {
          change: 1,
          changePercent: 0.00015
        },
        "1h": {
          change: -4,
          changePercent: -0.00062
        },
        "6h": {
          change: -68,
          changePercent: -0.01
        },
        "24h": {
          change: -294,
          changePercent: -0.045
        },
        "3d": {
          change: 2961,
          changePercent: 0.46
        },
        "7d": {
          change: 6624,
          changePercent: 1
        },
        "30d": {
          change: -69531,
          changePercent: -11
        }
      },
      holderDistribution: {
        whales: 2,
        sharks: 2,
        dolphins: 4,
        fish: 5,
        octopus: 16,
        crabs: 54,
        shrimps: 647558
      }
    };
  };
  
  export async function fetchTokenHolderDistribution(
    tokenAddress: string
  ): Promise<TokenHolderDistribution> {
    if (!MORALIS_API_KEY) {
      throw new Error("VITE_MORALIS_API environment variable is not defined");
    }
  
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-API-Key': MORALIS_API_KEY, // Now definitely a string
      },
    };
  
    try {
      const response = await customFetch(
        `https://solana-gateway.moralis.io/token/mainnet/holders/${tokenAddress}`,
        options
      );
      
      if (!response.ok) {
        console.warn(`Moralis API returned status ${response.status} for token ${tokenAddress}`);
        return simulateDistributionData(tokenAddress);
      }
      
      return (await response.json()) as TokenHolderDistribution;
    } catch (error) {
      console.error("Error fetching token holder distribution:", error);
      return simulateDistributionData(tokenAddress);
    }
  }
  
  // Generate mock holders data with deterministic addresses based on token address
  export async function fetchTopTokenHolders(tokenAddress: string): Promise<TokenHolder[]> {
    try {
      // Generate deterministic data based on token address
      const addressSeed = tokenAddress.slice(0, 8);
      const mockHolders: TokenHolder[] = [];
      
      for (let i = 0; i < 5; i++) {
        // Generate deterministic addresses
        const addressNum = parseInt(addressSeed, 16) + i * 1000;
        const address = addressNum.toString(16).padStart(40, '0');
        
        mockHolders.push({
          address: address,
          amount: 1000000 / (i + 1),
          percentage: 20 / (i + 1)
        });
      }
      
      return mockHolders;
    } catch (error) {
      console.error("Error generating top token holders:", error);
      return [];
    }
  }
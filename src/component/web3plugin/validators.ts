// // web3pluginvalidators.ts
// interface Validator {
//     votePubkey: string;
//     nodePubkey: string;
//     activatedStake: number;
//     commission: number;
//     lastVote: number;
//     epochVoteAccount: boolean;
//     rootSlot?: number;
//     version?: string;
//     name?: string;
//     website?: string;
//     keybaseUsername?: string;
//     delinquent?: boolean;
//     apyEstimate?: number;
//     uptime?: number;
//     score?: number;
//   }
  
//   const RPC_URL = 'https://mainnet.helius-rpc.com/?api-key=53b061f7-82e6-4436-a39e-fe1cbfdf0394';
//   const VALIDATOR_INFO_SOURCES = [
//     'https://validators.solana.fm/v1/validators/list',
//     'https://stakeview.app/api/validators',
//     'https://api.solanabeach.io/v1/validator'
//   ];
  
//   async function fetchWithFallback(urls: string[]): Promise<any> {
//     for (const url of urls) {
//       try {
//         const response = await fetch(url);
//         if (response.ok) return await response.json();
//       } catch (error) {
//         console.warn(`Failed to fetch from ${url}, trying next...`);
//       }
//     }
//     throw new Error('All validator info sources failed');
//   }
  
//   async function getValidatorInfo(nodePubkey: string): Promise<Partial<Validator>> {
//     try {
//       const info = await fetchWithFallback(VALIDATOR_INFO_SOURCES.map(url => `${url}/${nodePubkey}`));
//       return {
//         name: info.name || info.moniker,
//         website: info.website || info.web,
//         keybaseUsername: info.keybaseUsername || info.keybase,
//         uptime: info.uptime || info.uptimePercentage,
//         score: info.score || info.rating
//       };
//     } catch (error) {
//       console.warn('Using minimal validator info');
//       return {};
//     }
//   }
  
//   export async function fetchSolanaValidators(limit: number = 10): Promise<Validator[]> {
//     try {
//       console.log('[1/3] Fetching base validator data from Solana RPC...');
//       const voteResponse = await fetch(RPC_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           id: 1,
//           method: 'getVoteAccounts',
//           params: [{ keepUnstakedDelinquents: false }]
//         }),
//       });
  
//       if (!voteResponse.ok) throw new Error(`RPC error: ${voteResponse.status}`);
//       const voteData = await voteResponse.json();
  
//       console.log('[2/3] Processing validator rankings...');
//       const baseValidators = voteData.result.current
//         .sort((a: Validator, b: Validator) => b.activatedStake - a.activatedStake)
//         .slice(0, limit);
  
//       console.log('[3/3] Enhancing with additional validator metadata...');
//       const enhancedValidators = await Promise.all(
//         baseValidators.map(async (validator: Validator) => {
//           const additionalInfo = await getValidatorInfo(validator.nodePubkey);
//           return {
//             ...validator,
//             ...additionalInfo,
//             delinquent: validator.epochVoteAccount === false,
//             apyEstimate: calculateEstimatedAPY(validator.commission)
//           };
//         })
//       );
  
//       return enhancedValidators;
//     } catch (error) {
//       console.error('Validator fetch failed:', error);
//       throw new Error('Failed to fetch validator data. Please try again later.');
//     }
//   }
  
//   function calculateEstimatedAPY(commission: number): number {
//     const baseAPY = 6.5;
//     return baseAPY * (1 - commission / 100);
//   }
  
//   export function displayValidators(validators: Validator[]): void {
//     console.log(`\n=== SOLANA VALIDATOR REPORT ===`);
//     console.log(`Generated: ${new Date().toISOString()}`);
//     console.log(`Showing top ${validators.length} validators by stake\n`);
  
//     validators.forEach((validator, index) => {
//       console.log(`#${index + 1} ${validator.name || 'Validator'}`);
//       console.log(`  Node: ${validator.nodePubkey}`);
//       console.log(`  Vote: ${validator.votePubkey}`);
//       console.log(`  Stake: ${(validator.activatedStake / 10 ** 9).toLocaleString('en-US', { maximumFractionDigits: 2 })} SOL`);
//       console.log(`  Commission: ${validator.commission}%`);
//       console.log(`  Estimated APY: ${validator.apyEstimate?.toFixed(2) || 'N/A'}%`);
//       console.log(`  Status: ${validator.delinquent ? 'DELINQUENT' : 'ACTIVE'}`);
//       console.log(`  Last Vote Slot: ${validator.lastVote}`);
//       console.log(`  Root Slot: ${validator.rootSlot || 'N/A'}`);

//     });
  
//     console.log('=== END OF REPORT ===\n');
//   }
  
//   // Example usage with error handling
//   (async () => {
//     try {
//       const startTime = Date.now();
//       console.log('Initializing validator data fetch...');
      
//       const validators = await fetchSolanaValidators(5);
//       displayValidators(validators);
      
//       const endTime = Date.now();
//       console.log(`Completed in ${(endTime - startTime)/1000} seconds`);
//     } catch (error) {
//       console.error('Error:', error instanceof Error ? error.message : String(error));
//     }
//   })();

// web3plugin/validators.ts
interface Validator {
  votePubkey: string;
  nodePubkey: string;
  activatedStake: number;
  commission: number;
  lastVote: number;
  epochVoteAccount: boolean;
  rootSlot?: number;
  version?: string;
  name?: string;
  website?: string;
  keybaseUsername?: string;
  delinquent?: boolean;
  apyEstimate?: number;
  uptime?: number;
  score?: number;
}

const RPC_URL = 'https://mainnet.helius-rpc.com/?api-key=53b061f7-82e6-4436-a39e-fe1cbfdf0394';
const SOLANA_MAINNET_API = 'https://api.solanamainetbeta/validator';

async function fetchValidatorData(nodePubkey: string): Promise<any> {
  try {
    const response = await fetch(`${SOLANA_MAINNET_API}/${encodeURIComponent(nodePubkey)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch from Solana Mainnet API:', error);
    throw error;
  }
}

async function getValidatorInfo(nodePubkey: string): Promise<Partial<Validator>> {
  try {
    const data = await fetchValidatorData(nodePubkey);
    
    // Map the API response to your Validator interface
    return {
      name: data.validator?.name || data.name,
      website: data.validator?.website || data.website,
      keybaseUsername: data.validator?.keybaseUsername || data.keybase_username,
      uptime: data.validator?.uptime || data.uptimePercentage,
      score: data.validator?.score || data.rating,
      version: data.validator?.version,
      delinquent: data.validator?.delinquent
    };
  } catch (error) {
    console.warn('Using minimal validator info:', error);
    return {};
  }
}

function calculateEstimatedAPY(commission: number): number {
  const baseAPY = 6.5;
  return baseAPY * (1 - commission / 100);
}

export async function fetchSolanaValidators(limit: number = 10): Promise<Validator[]> {
  try {
    console.log('[1/3] Fetching base validator data from Solana RPC...');
    const voteResponse = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getVoteAccounts',
        params: [{ keepUnstakedDelinquents: false }]
      }),
    });

    if (!voteResponse.ok) {
      throw new Error(`RPC error: ${voteResponse.status}`);
    }

    const voteData = await voteResponse.json();
    
    if (!voteData.result) {
      throw new Error('Invalid RPC response format');
    }

    console.log('[2/3] Processing validator rankings...');
    const baseValidators = (voteData.result.current || [])
      .sort((a: any, b: any) => b.activatedStake - a.activatedStake)
      .slice(0, limit);

    console.log('[3/3] Enhancing with validator metadata...');
    const enhancedValidators = await Promise.all(
      baseValidators.map(async (validator: any) => {
        const additionalInfo = await getValidatorInfo(validator.nodePubkey);
        return {
          ...validator,
          ...additionalInfo,
          delinquent: validator.epochVoteAccount === false,
          apyEstimate: calculateEstimatedAPY(validator.commission)
        };
      })
    );

    return enhancedValidators;
  } catch (error) {
    console.error('Validator fetch failed:', error);
    throw new Error(`Failed to fetch validator data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchValidatorDetails(nodePubkey: string): Promise<Validator> {
  try {
    console.log('[1/2] Fetching base validator data from Solana RPC...');
    const voteResponse = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getVoteAccounts',
        params: [{ keepUnstakedDelinquents: true }]
      }),
    });

    if (!voteResponse.ok) {
      throw new Error(`RPC error: ${voteResponse.status}`);
    }

    const voteData = await voteResponse.json();
    
    // Combine current and delinquent validators
    const allValidators = [
      ...(voteData.result.current || []),
      ...(voteData.result.delinquent || [])
    ];
    
    const validator = allValidators.find((v: any) => v.nodePubkey === nodePubkey);

    if (!validator) {
      throw new Error(`Validator ${nodePubkey} not found in vote accounts`);
    }

    console.log('[2/2] Fetching validator details...');
    const additionalInfo = await getValidatorInfo(nodePubkey);

    return {
      ...validator,
      ...additionalInfo,
      delinquent: validator.epochVoteAccount === false,
      apyEstimate: calculateEstimatedAPY(validator.commission)
    };
  } catch (error) {
    console.error('Validator details fetch failed:', error);
    throw new Error(
      `Failed to fetch validator details: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
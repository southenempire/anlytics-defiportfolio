/**
 * Types for Blaze Stake API response
 */
interface BlazeStakeSuccessResponse {
    status: "success";
    stakes: Record<string, number>; // validator_vote_account: decimal_sol_amount
  }
  
  interface BlazeStakeErrorResponse {
    status: "error";
    error: string;
  }
  
  type BlazeStakeResponse = BlazeStakeSuccessResponse | BlazeStakeErrorResponse;
  
  /**
   * Fetches target stakes for a user from Blaze Stake API
   * @param address - The wallet address to query
   * @returns Promise with the API response
   * @throws Error if the request fails
   */
  export async function getTargetStakes(address: string): Promise<BlazeStakeResponse> {
    if (!address) {
      return {
        status: "error",
        error: "missing parameters",
      };
    }
  
    try {
      const apiUrl = `https://stake.solblaze.org/api/v1/cls_user_target?address=${encodeURIComponent(address)}`;
      console.log('Fetching from URL:', apiUrl);
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Raw API response:', JSON.stringify(data, null, 2));
  
      // More detailed validation
      if (data === null || typeof data !== 'object') {
        throw new Error('API response is not an object');
      }
      
      if (data.status !== 'success' && data.status !== 'error') {
        throw new Error(`Invalid status field: ${data.status}`);
      }
      
      if (data.status === 'success' && (!data.stakes || !Array.isArray(data.stakes))) {
        throw new Error('Missing or invalid stakes array in successful response');
      }
      
      if (data.status === 'error' && typeof data.error !== 'string') {
        throw new Error('Missing or invalid error message in error response');
      }
  
      return data as BlazeStakeResponse;
    } catch (error) {
      console.error('Error fetching target stakes:', error);
      return {
        status: "error",
        error: error instanceof Error ? error.message : 'unknown error',
      };
    }
  }
  
  /**
   * Example usage
   */
  async function exampleUsage() {
    console.log('Starting Blaze Stake API test...');
    const walletAddress = '2TyezznQutRbfxV4om3JCbSyDmD4q95bfR6p3tqs76Nf';
    console.log('Querying address:', walletAddress);
    const result = await getTargetStakes(walletAddress);
  
    if (result.status === 'success') {
      console.log('Target stakes:', result.stakes);
      // Process the stakes data in your app
    } else {
      console.error('Error:', result.error);
      // Handle error in your app
    }
  }
  
  // Run the example
  exampleUsage();
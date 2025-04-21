// src/services/bubblemapsApi.ts
import { BubblemapsTokenMetadata } from '../../types/bubblemap';

// Explicit type for error responses
interface BubblemapsErrorResponse {
    status: 'KO';
    message: string;
  }
  
  // Union type for all possible API responses
  type BubblemapsApiResponse = BubblemapsTokenMetadata | BubblemapsErrorResponse;
  
  // Type guard function to check if response is an error
  function isErrorResponse(response: BubblemapsApiResponse): response is BubblemapsErrorResponse {
    return response.status === 'KO';
  }
  
  /**
   * Fetches token metadata from Bubblemaps Legacy API for Solana tokens
   * @param {string} tokenAddress - Solana token address
   * @returns {Promise<BubblemapsTokenMetadata>} - API response data
   * @throws {Error} - When the API request fails or returns KO status
   */
  export const fetchTokenMetadata = async (tokenAddress: string): Promise<BubblemapsTokenMetadata> => {
    try {
      const response = await fetch(
        `https://api-legacy.bubblemaps.io/map-metadata?chain=sol&token=${tokenAddress}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: BubblemapsApiResponse = await response.json();
      
      // Use type guard to safely check for error response
      if (isErrorResponse(data)) {
        throw new Error(data.message || 'Unknown error from Bubblemaps API');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      throw error;
    }
  };
  
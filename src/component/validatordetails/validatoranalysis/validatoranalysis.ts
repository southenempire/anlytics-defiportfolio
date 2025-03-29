// web3plugin/validatorAnalytics.ts
interface TransferData {
    date: string;
    transferIn: number;
    transferOut: number;
    netFlow: number;
  }
  
  export async function fetchValidatorTransfers(nodePubkey: string): Promise<TransferData[]> {
    try {
      // Example using Helius API
      const response = await fetch(
        `https://api.helius.xyz/v0/validators/${nodePubkey}/transfers?api-key=https://mainnet.helius-rpc.com/?api-key=53b061f7-82e6-4436-a39e-fe1cbfdf0394`
      );
      
      if (!response.ok) throw new Error('Failed to fetch transfer data');
      
      const rawData = await response.json();
      
      // Transform data to our format
      return rawData.map((day: any) => ({
        date: new Date(day.timestamp).toLocaleDateString(),
        transferIn: day.transfer_in / 10**9, // Convert lamports to SOL
        transferOut: day.transfer_out / 10**9,
        netFlow: (day.transfer_in - day.transfer_out) / 10**9
      }));
      
    } catch (error) {
      console.error("Error fetching validator transfers:", error);
      // Fallback mock data
      return generateMockData();
    }
  }
  
  function generateMockData(): TransferData[] {
    const days = 30;
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      
      const transferIn = Math.random() * 1000;
      const transferOut = Math.random() * 800;
      
      return {
        date: date.toLocaleDateString(),
        transferIn,
        transferOut,
        netFlow: transferIn - transferOut
      };
    });
  }
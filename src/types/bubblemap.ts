// src/types/bubblemaps.ts
export interface BubblemapsTokenMetadata {
    decentralisation_score: number;
    identified_supply: {
      percent_in_cexs: number;
      percent_in_contracts: number;
    };
    dt_update: string;
    ts_update: number;
    status: 'OK';
  }
  
  export interface TokenDetails {
    name: string;
    logo: string;
    price: number;
    address: string;
    liquidity: number;
    fdv: number;
    status: string;
    priceNative: string;
    symbol: string;
    metadata?: BubblemapsTokenMetadata;
  }
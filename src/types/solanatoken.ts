// src/types/solanaTokens.ts
export interface SolanaToken {
  name: string;
  symbol: string;
  address: string;
  logo?: string;
}
  
  export const popularSolanaTokens: SolanaToken[] = [
    {
      name: "Bonk",
      symbol: "BONK",
      address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
      logo: "https://assets.coingecko.com/coins/images/28600/large/bonk.jpg"
    },
    {
      name: "Jupiter",
      symbol: "JUP",
      address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
      logo: "https://assets.coingecko.com/coins/images/34188/large/jup.png"
    },
    {
      name: "Raydium",
      symbol: "RAY",
      address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
      logo: "https://assets.coingecko.com/coins/images/13928/large/PSigc4ie_400x400.jpg"
    },
    {
      name: "Tensor",
      symbol: "TNSR",
      address: "TNSRxcUxoT9xBG3de7PiJyTDYu7kskLqcpddxnEJAS6",
      logo: "https://assets.coingecko.com/coins/images/35972/standard/tnsr.png?1712687367"
    },
    {
      name: "Jito",
      symbol: "JTO",
      address: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL",
      logo: "https://assets.coingecko.com/coins/images/33228/standard/jto.png?1701137022"
    },
    {
      name: "Pyth Network",
      symbol: "PYTH",
      address: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
      logo: "https://assets.coingecko.com/coins/images/31924/standard/pyth.png?1701245725"
    },
    {
      name: "Marinade",
      symbol: "MNDE",
      address: "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
      logo: "https://assets.coingecko.com/coins/images/18867/standard/MNDE.png?1696518327"
    }
  ];
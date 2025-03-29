import React from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

// This is the component we created earlier
const WalletConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const network = React.useMemo(() => clusterApiUrl('mainnet-beta'), []);
  const wallets = React.useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);
  

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletConnectionProvider;
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from './component/Navbar';
import Login from './component/Login';
import './App.css';
import './wallet-ovrride.css';
import Dashboard from './component/dashboard';
import Tradetoken from './component/tokenlist';
import TokenDetailsWithSwap from './component/tradetoken/page';
import WalletConnectionProvider from './WalletAdapter/page';
import { Buffer } from "buffer";
import ValidatorsList from './component/validatorlist';
import ValidatorDetails from './component/validatordetails/page';
import WatchAddress from './component/watchaddr';
import { CivicAuthProvider, useUser } from '@civic/auth-web3/react';
import '@solana/wallet-adapter-react-ui/styles.css';
import UserProfile from './component/Profile';
import WalletPortfolio from './component/watchwallet/page';
import UrlVerifier from './component/Dapps/page';
import { useWallet } from '@solana/wallet-adapter-react';
import LandingPage from './component/landingpage/page';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

(window as any).Buffer = Buffer;

function WalletToast() {
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    if (connected && publicKey) {
      toast.success(`Connected to ${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`, {
        duration: 5000,
        position: 'top-right',
        style: {
          background: '#1F2937',
          color: '#fff',
          border: '1px solid #374151',
          padding: '16px',
          fontSize: '16px',
          maxWidth: '400px',
        },
        icon: '🔗',
      });
    }
  }, [connected, publicKey]);

  return null;
}

function ProtectedRoute() {
  const { user } = useUser();
  const { connected } = useWallet();
  const location = useLocation();

  // Allow access if either email is authenticated or wallet is connected
  if (!user && !connected) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

function Layout() {
  const location = useLocation();
  const hideNavbarPaths = ['/', '/login'];

  return (
    <div className="min-h-screen bg-white">
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/portfolio" element={<Dashboard />} />
          <Route path="/validators" element={<ValidatorsList />} />
          <Route path="/validator/:nodePubkey" element={<ValidatorDetails />} />
          <Route path="/token" element={<Tradetoken />} />
          <Route path="/swap" element={<TokenDetailsWithSwap />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/watch-wallet' element={<WalletPortfolio />} />
          <Route path='/dapps' element={<UrlVerifier />} />
        </Route>
        <Route path="/watch" element={<WatchAddress />} />
        
        {/* Fallback to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <WalletConnectionProvider>
      <CivicAuthProvider
        clientId={import.meta.env.VITE_CIVIC_CLIENT_ID}
        displayMode="iframe"
        onSignIn={(error: any) => {
          if (error) {
            console.error("Sign in error:", error);
          } else {
            console.log("Sign in successful");
          }
        }}
      >
        <Router>
          <Toaster />
          <WalletToast />
          <Layout />
        </Router>
      </CivicAuthProvider>
    </WalletConnectionProvider>
  );
}

export default App;
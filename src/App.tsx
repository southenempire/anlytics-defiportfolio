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

(window as any).Buffer = Buffer;

function ProtectedRoute() {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {location.pathname !== '/' && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        
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
          <Layout />
        </Router>
      </CivicAuthProvider>
    </WalletConnectionProvider>
  );
}

export default App;
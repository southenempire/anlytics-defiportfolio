import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from './component/Navbar';
import Home from './component/home';
import './App.css';
import './wallet-ovrride.css';
import Dashboard from './component/dashboard';
import Tradetoken from './component/tokenlist';
import TokenDetailsWithSwap from './component/tradetoken/page';
import WalletConnectionProvider from './WalletAdapter/page';
import { Buffer } from "buffer";
import { useWallet } from '@solana/wallet-adapter-react';
import ValidatorsList from './component/validatorlist';
import ValidatorDetails from './component/validatordetails/page';
import { useEffect } from 'react';

(window as any).Buffer = Buffer;

function ProtectedRoute() {
  const { connected } = useWallet();
  const location = useLocation();

  if (!connected) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

function HomeRedirect() {
  const { connected } = useWallet();
  const location = useLocation();

  // If connected and on home page, redirect to portfolio
  if (connected && location.pathname === '/') {
    return <Navigate to="/portfolio" replace />;
  }

  return <Home />;
}

function App() {
  return (
    <WalletConnectionProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/portfolio" element={<Dashboard />} />
              <Route path="/validators" element={<ValidatorsList />} />
              <Route path="/validator/:nodePubkey" element={<ValidatorDetails />} />
              <Route path="/token" element={<Tradetoken />} />
              <Route path="/swap" element={<TokenDetailsWithSwap />} />
            </Route>
            
            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/portfolio" replace />} />
          </Routes>
        </div>
      </Router>
    </WalletConnectionProvider>
  );
}

export default App;
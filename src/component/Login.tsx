import { useUser } from "@civic/auth-web3/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from '@solana/wallet-adapter-react';
import { Home } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const { user, signIn } = useUser();
  const { connected, publicKey } = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn();
      toast.success('Successfully signed in with email!', {
        duration: 9000,
        position: 'top-right',
        style: {
          background: '#1F2937',
          color: '#fff',
          border: '1px solid #374151',
          padding: '16px',
          fontSize: '16px',
          maxWidth: '400px',
        },
        icon: '🎉',
      });
    } catch (error) {
      console.error("Sign-in failed:", error);
      toast.error('Failed to sign in. Please try again.', {
        duration: 9000,
        position: 'top-right',
        style: {
          background: '#1F2937',
          color: '#fff',
          border: '1px solid #374151',
          padding: '16px',
          fontSize: '16px',
          maxWidth: '400px',
        },
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  useEffect(() => {
    const createWallet = async () => {
      setIsCreating(true);  
      try {
        if (user && !('solana' in user)) {
          const civicUser = user as any;
          if (civicUser.createWallet) {
            await civicUser.createWallet();
            console.log("Wallet created successfully");
            toast.success('Wallet created successfully!', {
              duration: 9000,
              position: 'top-right',
              style: {
                background: '#1F2937',
                color: '#fff',
                border: '1px solid #374151',
                padding: '16px',
                fontSize: '16px',
                maxWidth: '400px',
              },
              icon: '💫',
            });
          }
        }
      } catch (error) {
        console.error("Wallet creation failed:", error);
        toast.error('Failed to create wallet. Please try again.', {
          duration: 9000,
          position: 'top-right',
          style: {
            background: '#1F2937',
            color: '#fff',
            border: '1px solid #374151',
            padding: '16px',
            fontSize: '16px',
            maxWidth: '400px',
          },
        });
      } finally {
        setIsCreating(false); 
      }
    };
  
    if (user) {
      createWallet();
      navigate("/portfolio");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (connected && publicKey) {
      navigate("/portfolio");
    }
  }, [connected, publicKey, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <Toaster />
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-60 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Go Home Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 px-4 py-2 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 shadow-lg shadow-purple-500/10"
      >
        <Home className="w-5 h-5" />
        <span className="hidden sm:inline">Go Home</span>
      </button>

      <div className="relative flex justify-center items-center min-h-screen px-4 sm:px-6">
        <div className="w-full max-w-lg">
          <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl shadow-purple-500/20 p-6 sm:p-10">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />
            
            {/* Content */}
            <div className="relative">
              <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 text-center mb-3 sm:mb-4">
                Welcome to SAFRA
              </h1>
              <p className="text-gray-400 text-center mb-6 sm:mb-8 text-base sm:text-lg">
                Choose your preferred sign-in method to manage your portfolio and explore tokens.
              </p>

              {!user ? (
                <div className="space-y-4 sm:space-y-6">
                  <button
                    onClick={handleSignIn}
                    disabled={isSigningIn || isCreating}
                    className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-medium text-white text-sm sm:text-base transition-all flex items-center justify-center
                      ${isSigningIn || isCreating 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20'}`}
                  >
                    {isSigningIn ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-3 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing In...
                      </>
                    ) : isCreating ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-3 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating Wallet...
                      </>
                    ) : (
                      'Sign In with Email'
                    )}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700/50"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gray-800/30 text-gray-400">or</span>
                    </div>
                  </div>

                  <div className="w-full flex justify-center">
                    <WalletMultiButton className="!w-full !bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 !text-white !py-3 sm:!py-4 !rounded-xl !shadow-lg !shadow-purple-500/20 hover:!shadow-xl hover:!shadow-purple-500/30" />
                  </div>
                </div>
              ) : (
                <div className="w-full flex justify-center">
                  <WalletMultiButton className="!bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 !text-white !py-3 sm:!py-4 !rounded-xl !shadow-lg !shadow-purple-500/20 hover:!shadow-xl hover:!shadow-purple-500/30" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

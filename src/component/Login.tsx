import { useUser } from "@civic/auth-web3/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { user, signIn } = useUser();
  const [isCreating, setIsCreating] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn();
    } catch (error) {
      console.error("Sign-in failed:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  useEffect(() => {
    const createWallet = async () => {
      if (user && !('solana' in user)) {
        try {
          setIsCreating(true);
          const civicUser = user as any;
          if (civicUser.createWallet) {
            await civicUser.createWallet();
            console.log("Wallet created successfully");
          }
        } catch (error) {
          console.error("Wallet creation failed:", error);
        } finally {
          setIsCreating(false);
        }
      }
    };

    if (user) {
      createWallet();
      navigate("/portfolio");
    }
  }, [user, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow-lg p-10">
        <h1 className="text-3xl font-bold text-black text-center mb-2">
          Welcome to Web3 Portfolio
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Sign in with your email to manage your portfolio and explore tokens.
        </p>
        {!user ? (
          <button
            onClick={handleSignIn}
            disabled={isSigningIn || isCreating}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center
              ${isSigningIn || isCreating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800'}`}
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
        ) : (
          <div className="w-full flex justify-center">
            <WalletMultiButton className="!bg-black !text-white hover:!bg-gray-800 !py-3 !rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
}
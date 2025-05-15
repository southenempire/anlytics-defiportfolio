import { useUser } from "@civic/auth-web3/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { LogOut, Mail, Wallet } from "lucide-react";

export default function UserProfile() {
  const { user, signOut } = useUser();
  const { publicKey, disconnect } = useWallet();

  // Generate initials for avatar placeholder
  const getInitials = (email: string | undefined) => {
    if (!email) return "U";
    const parts = email.split("@")[0].split(".");
    return parts.length > 1 
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() 
      : email[0].toUpperCase();
  };

  const handleLogout = async () => {
    try {
      if (user) {
        await signOut();
        console.log("Logged out successfully");
      }
      if (publicKey) {
        await disconnect();
        console.log("Wallet disconnected successfully");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
      <div className="max-w-md mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-lg font-semibold text-white">
              {user ? getInitials(user.email) : "W"}
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                {user ? "User Profile" : "Wallet Profile"}
              </h2>
              <p className="text-xs text-gray-400">
                {user ? "Manage your account details" : "View your wallet details"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
          >
            <LogOut size={16} />
            <span>{user ? "Log Out" : "Disconnect"}</span>
          </button>
        </div>

        {/* Details Section */}
        <div className="bg-gray-700/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <span>{user ? "Account Information" : "Wallet Information"}</span>
          </h3>
          <div className="space-y-4">
            {/* Email - Only show if user is authenticated with email */}
            {user && (
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-gray-200 font-medium">
                    {user.email || <span className="text-gray-400 italic">Not provided</span>}
                  </p>
                </div>
              </div>
            )}

            {/* Wallet Address - Show for both email and wallet-only users */}
            {publicKey && (
              <div className="flex items-start gap-3">
                <Wallet size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Wallet Address</p>
                  <p className="text-gray-200 font-mono text-sm break-all hover:text-purple-300 transition-colors">
                    {publicKey.toBase58()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
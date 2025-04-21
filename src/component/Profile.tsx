import { useUser } from "@civic/auth-web3/react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function UserProfile() {
  const { user, signOut } = useUser();
  const { publicKey } = useWallet();

  if (!user) return null;

  // Generate initials for avatar placeholder
  const getInitials = (email: string | undefined) => {
    if (!email) return "U";
    const parts = email.split("@")[0].split(".");
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : email[0].toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white border border-gray-200 rounded-xl shadow-lg">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-semibold text-gray-600">
            {getInitials(user.email)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-black">User Profile</h2>
            <p className="text-sm text-gray-500">Manage your account details</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="py-2 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Log Out
        </button>
      </div>

      {/* Details Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Account Information</h3>
        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-gray-500 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 12l-4-4m0 0l-4 4m4-4v12"
              />
            </svg>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-black font-medium">
                {user.email || <span className="text-gray-400 italic">Not provided</span>}
              </p>
            </div>
          </div>

          {/* Wallet Address */}
          {publicKey && (
            <div className="flex items-start space-x-3">
              <svg
                className="w-5 h-5 text-gray-500 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Wallet Address</p>
                <p className="text-black font-mono text-sm break-all hover:text-gray-700 transition-colors">
                  {publicKey.toBase58()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
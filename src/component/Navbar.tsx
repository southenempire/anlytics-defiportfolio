// src/component/Navbar.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Search, Shield } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const navItems = [
        { label: 'Portfolio', to: '/portfolio' },
        { label: 'Pump Fun', to: '/token' },
        { label: 'Validators', to: '/validators' },
        { label: 'Profile', to: '/profile' },
        { label: 'Watch Wallet', to: '/watch-wallet' },
        { label: 'dApps', to: '/dapps' } 
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/watch?address=${searchQuery.trim()}`);
            setSearchQuery('');
        }
    };

    return (
        <nav className="bg-gray-900 shadow-md sticky top-0 z-100 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <Shield className="text-purple-500 mr-2" size={20} />
                            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">KAMING</span>
                            <span className="text-xs bg-blue-600 text-gray-100 ml-2 px-2 py-0.5 rounded-full">Beta</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex space-x-1 items-center">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.to}
                                className="text-gray-300 hover:bg-gray-800 hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Dropdown Trigger */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center text-gray-300 hover:bg-gray-800 px-3 py-2 rounded-md"
                        >
                            Menu <ChevronDown className="ml-2" size={20} />
                        </button>
                    </div>

                    {/* Search Field - Desktop */}
                    <div className="hidden lg:flex mx-4 flex-1 max-w-md">
                        <form onSubmit={handleSearch} className="w-full">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search Solana address..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </form>
                    </div>

                    {/* Right Side Buttons */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {/* Custom styling for the WalletMultiButton will need wallet adapter CSS overrides */}
                        <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-blue-500 !rounded-lg !text-sm !shadow-lg hover:!from-purple-600 hover:!to-blue-600 !transition-all !duration-200" />
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="lg:hidden absolute left-0 right-0 bg-gray-900 shadow-lg border-t border-gray-800 z-40">
                        {/* Mobile Search Field */}
                        <div className="px-4 py-3">
                            <form onSubmit={handleSearch} className="w-full">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search Solana address..."
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    to={item.to}
                                    className="text-gray-300 hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                        <div className="px-4 py-3 border-t border-gray-800 flex justify-center items-center">
                            <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-blue-500 !rounded-lg !text-sm !shadow-lg hover:!from-purple-600 hover:!to-blue-600 !transition-all !duration-200 !w-full" />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
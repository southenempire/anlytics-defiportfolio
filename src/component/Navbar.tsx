// src/component/Navbar.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Search } from 'lucide-react';
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
        { label: 'watch-wallet', to: '/watch-wallet' } // Fixed: changed 'Label' to 'label'
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/watch?address=${searchQuery.trim()}`);
            setSearchQuery('');
        }
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-gray-800">KAMING</span>
                            <span className="text-xs bg-blue-500 text-white ml-2 px-2 py-1 rounded">Beta</span>
                        </Link>
                    </div>


                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex space-x-4 items-center">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.to}
                                className="text-gray-800 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Dropdown Trigger */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md"
                        >
                            Menu <ChevronDown className="ml-2" size={20} />
                        </button>
                    </div>



                    {/* Search Field - Desktop */}
                    <div className="hidden lg:flex mx-4 flex-1 max-w-md">
                        <form onSubmit={handleSearch} className="w-full">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search Solana address..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </form>
                    </div>

                    {/* Right Side Buttons */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <WalletMultiButton />
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="lg:hidden absolute left-0 right-0 bg-white shadow-lg">
                        {/* Mobile Search Field */}
                        <div className="px-4 py-3">
                            <form onSubmit={handleSearch} className="w-full">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search Solana address..."
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                                    className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                        <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center">
                            <WalletMultiButton />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, Shield,  Rocket, LineChart, Activity, Lock, Network } from 'lucide-react';
import dashboardimage from '../../assets/dashboard.png';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Real-time portfolio tracking with advanced metrics and performance analysis across all your DeFi positions."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Security First",
      description: "Enterprise-grade security with real-time threat detection and automated protection for your assets."
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: "Multi-Chain Support",
      description: "Seamlessly manage your assets across Solana and other major blockchain networks in one unified dashboard."
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Real-Time Monitoring",
      description: "Instant notifications and alerts for portfolio changes, security threats, and market opportunities."
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: "Performance Tracking",
      description: "Track your ROI, APY, and other key metrics with detailed historical data and trend analysis."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Secure Urls",
      description: "Verify the authenticity of any URL with our advanced URL verification system."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-60 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-white font-bold text-xl">SAFRA</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30"
            >
              Launch App
              <Rocket className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg shadow-purple-500/10">
            <span className="text-sm text-gray-300">🚀 Next-Gen DeFi Analytics</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6 drop-shadow-lg">
            SAFRA DeFi Forensic Portfolio for Degens
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Track, analyze, and secure your DeFi assets with advanced forensic tools. Built for degens, by degens.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 text-white rounded-lg font-medium transition-all duration-200 border border-gray-700 shadow-lg shadow-purple-500/10 hover:shadow-xl hover:shadow-purple-500/20"
            >
              Watch Address
            </button>
          </div>

          {/* Dashboard Preview Section */}
          <div className="relative max-w-6xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl rounded-3xl animate-pulse" />
            <div className="relative bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-gray-700/50 overflow-hidden shadow-2xl shadow-purple-500/20 hover:shadow-3xl hover:shadow-purple-500/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" />
              <div className="relative p-1">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-blue-500" />
                <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                <div className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500" />
                <img
                  src={dashboardimage}
                  alt="Dashboard Preview"
                  className="w-full h-auto rounded-2xl shadow-2xl shadow-purple-500/20 hover:shadow-3xl hover:shadow-purple-500/30 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Enhanced */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-4">
            Powerful Features for Modern DeFi
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to manage, secure, and grow your DeFi portfolio in one place
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-500 transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
              99.9%
            </div>
            <div className="text-gray-400">Uptime Guarantee</div>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
              <span className="text-2xl">$</span>100M+
            </div>
            <div className="text-gray-400">Assets Protected</div>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
              24/7
            </div>
            <div className="text-gray-400">Support Available</div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-800/20 backdrop-blur-sm border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-200">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
                $100M+
              </div>
              <div className="text-gray-400">Assets Tracked</div>
            </div>
            <div className="p-6 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-200">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
                20+
              </div>
              <div className="text-gray-400">Assets Tracked on PumpFun</div>
            </div>
            <div className="p-6 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-200">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
                24/7
              </div>
              <div className="text-gray-400">Real-time Monitoring</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-12 border border-gray-700/50 shadow-2xl shadow-purple-500/20 hover:shadow-3xl hover:shadow-purple-500/30 transition-all duration-300">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Secure Your DeFi Portfolio?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of degens who trust our platform to track and secure their DeFi assets.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 mx-auto shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30"
          >
            Launch App
            <Rocket className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}


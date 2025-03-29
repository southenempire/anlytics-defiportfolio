
const Home = () => {
  const newsItems = [
    {
      title: "Solana TVL Reaches New All-Time High",
      date: "March 28, 2025",
      source: "Decrypt",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLV84rSWF6F71mUfjkMETbLDCPErOMYAHVjQ&s"
    },
    {
      title: "Major DeFi Protocol Launches on Solana",
      date: "March 27, 2025",
      source: "CoinDesk",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLV84rSWF6F71mUfjkMETbLDCPErOMYAHVjQ&s"
    },
    {
      title: "Solana Foundation Announces Developer Grants",
      date: "March 25, 2025",
      source: "The Block",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLV84rSWF6F71mUfjkMETbLDCPErOMYAHVjQ&s"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-white">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Solana Price Card (Left Column) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center mr-3">
                <span className="font-bold text-white">SOL</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Solana</h2>
            </div>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-gray-900">$129.42</span>
              <span className="ml-3 px-2 py-1 bg-red-100 text-red-600 rounded-full text-sm">-6.7%</span>
            </div>
          </div>
          
          {/* Chart */}
          <div className="h-48 w-full relative">
            <svg viewBox="0 0 400 150" className="w-full h-full">
              <path 
                d="M0,30 C20,20 40,60 60,50 C80,40 100,80 120,70 C140,60 160,40 180,50 C200,60 220,40 240,50 C260,60 280,30 300,40 C320,50 340,20 360,30 C380,40 400,20 420,30" 
                fill="none" 
                stroke="#000" 
                strokeWidth="2"
              />
              <path 
                d="M0,30 C20,20 40,60 60,50 C80,40 100,80 120,70 C140,60 160,40 180,50 C200,60 220,40 240,50 C260,60 280,30 300,40 C320,50 340,20 360,30 C380,40 400,20 420,30 L420,150 L0,150 Z" 
                fill="url(#gradient)" 
                fillOpacity="0.1"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#000" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#000" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <div className="flex justify-between text-gray-500 text-xs mt-2">
            <span>01:00</span>
            <span>05:00</span>
            <span>09:00</span>
            <span>13:00</span>
            <span>17:00</span>
            <span>21:00</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500 text-sm">Transactions Per Second</p>
              <p className="text-2xl font-bold text-gray-900">4,139</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500 text-sm">Market Cap</p>
              <p className="text-2xl font-bold text-gray-900">$12.5B</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500 text-sm">Active Wallets</p>
              <p className="text-2xl font-bold text-gray-900">1,838,041</p>
            </div>
          </div>
        </div>

        {/* Learn Card (Right Column) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Learn about Solana</h2>
          <p className="text-gray-600 mb-4">
            Discover how Solana's high-performance blockchain enables fast, secure, and scalable 
            decentralized apps with minimal transaction costs.
          </p>
          <div className="flex justify-between items-center">
            <button className="bg-black text-white hover:bg-gray-800 py-2 px-6 rounded-lg font-medium">
              Start Learning
            </button>
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-600">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* News and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* News Card */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Latest Solana News</h2>
            <button className="text-sm text-gray-500 hover:text-black">View All →</button>
          </div>
          <div className="space-y-4">
            {newsItems.map((news, index) => (
              <div key={index} className="flex items-start">
                <img 
                  src={news.image} 
                  alt={news.title} 
                  className="w-16 h-12 object-cover rounded-lg mr-4"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{news.title}</h3>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span>{news.source}</span>
                    <span className="mx-2">•</span>
                    <span>{news.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white border border-gray-200 hover:border-black rounded-xl p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center mb-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <span className="font-medium text-gray-900">Buy SOL</span>
          </button>
          <button className="bg-white border border-gray-200 hover:border-black rounded-xl p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center mb-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2zm0-16h2v6h-2z"/>
              </svg>
            </div>
            <span className="font-medium text-gray-900">Send/Receive</span>
          </button>
          <button className="bg-white border border-gray-200 hover:border-black rounded-xl p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center mb-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </div>
            <span className="font-medium text-gray-900">Analytics</span>
          </button>
          <button className="bg-white border border-gray-200 hover:border-black rounded-xl p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center mb-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
            </div>
            <span className="font-medium text-gray-900">DeFi Explorer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
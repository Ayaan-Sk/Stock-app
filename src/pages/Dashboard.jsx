import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    Search,
    LogOut,
    TrendingUp,
    TrendingDown,
    Activity,
    BarChart3,
    Cpu,
    ChevronRight,
    User
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { generateHistory, getPrediction, getStockDetails, SYMBOLS } from '../services/stockService';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [search, setSearch] = useState('');
    const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
    const [history, setHistory] = useState([]);
    const [details, setDetails] = useState({});
    const [prediction, setPrediction] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [timeframe, setTimeframe] = useState('1M');

    useEffect(() => {
        const data = generateHistory(selectedSymbol);
        setHistory(data);
        setDetails(getStockDetails(selectedSymbol));
        setPrediction(null);
    }, [selectedSymbol]);

    const handlePredict = async () => {
        setIsPredicting(true);
        const result = await getPrediction(selectedSymbol, history);
        setPrediction(result);
        setIsPredicting(false);
    };

    const filteredSymbols = SYMBOLS.filter(s => s.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="min-h-screen text-slate-200 font-sans pb-10">
            {/* Top Navbar */}
            <nav className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-neon-cyan rounded-lg flex items-center justify-center font-bold text-black rotate-12">Q</div>
                        <span className="text-xl font-bold tracking-tight hidden sm:block">
                            Quantum<span className="text-neon-cyan">Stock</span>
                        </span>
                    </div>

                    <div className="flex-1 max-w-md mx-8 relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search symbol..."
                            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-neon-cyan/50 text-sm transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/5 py-1.5 px-3 rounded-full border border-white/10">
                            <User className="w-4 h-4 text-neon-cyan" />
                            <span className="text-xs font-semibold">{user?.name}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-red-400"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Side: Search and List */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="glass-card p-4 rounded-2xl">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-1">Market Watch</h3>
                        <div className="space-y-1">
                            {filteredSymbols.map(symbol => (
                                <button
                                    key={symbol}
                                    onClick={() => setSelectedSymbol(symbol)}
                                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all ${selectedSymbol === symbol ? 'bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-bold' : 'hover:bg-white/5 border border-transparent'
                                        }`}
                                >
                                    <span>{symbol}</span>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedSymbol === symbol ? 'rotate-90' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handlePredict}
                        disabled={isPredicting}
                        className={`w-full py-4 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-2xl text-black font-extrabold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_0_20px_rgba(0,255,255,0.2)] disabled:opacity-50 group overflow-hidden relative`}
                    >
                        {isPredicting ? (
                            <Activity className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Cpu className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>ANALYZE WITH AI</span>
                            </>
                        )}
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </button>
                </div>

                {/* Right Side: Overview and Chart */}
                <div className="lg:col-span-9 space-y-6">
                    {/* Stock Overview Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 glass-card p-6 rounded-2xl flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-3xl font-extrabold tracking-tight">{details.name}</h2>
                                    <span className="text-slate-500 font-mono">{selectedSymbol}</span>
                                </div>
                                <div className="flex items-baseline gap-4 mt-1">
                                    <span className="text-4xl font-mono font-bold">${history[history.length - 1]?.price.toFixed(2)}</span>
                                    <div className={`flex items-center font-bold ${parseFloat(details.change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {parseFloat(details.change) >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                                        {details.change}%
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Market Cap</p>
                                    <p className="text-lg font-mono font-bold">${details.marketCap}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Volume (24h)</p>
                                    <p className="text-lg font-mono font-bold">{details.volume}</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                            <div className={`p-4 rounded-full mb-4 ${parseFloat(details.change) >= 0 ? 'bg-green-400/10' : 'bg-red-400/10'}`}>
                                {parseFloat(details.change) >= 0 ?
                                    <TrendingUp className="w-8 h-8 text-green-400" /> :
                                    <TrendingDown className="w-8 h-8 text-red-400" />
                                }
                            </div>
                            <p className="text-slate-400 text-sm font-medium">Market Sentiment</p>
                            <h4 className={`text-2xl font-black ${parseFloat(details.change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {parseFloat(details.change) >= 0 ? 'BULLISH' : 'BEARISH'}
                            </h4>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="glass-card p-6 rounded-3xl min-h-[400px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="flex items-center gap-2 font-bold text-lg">
                                <BarChart3 className="w-5 h-5 text-neon-cyan" />
                                History & AI Forecast
                            </h3>
                            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                                {['7D', '1M', '6M', '1Y'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTimeframe(t)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${timeframe === t ? 'bg-neon-cyan text-black' : 'text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={history}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00ffff" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#00ffff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#475569"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        stroke="#475569"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={['auto', 'auto']}
                                        tickFormatter={(val) => `$${val}`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            borderColor: 'rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            color: '#fff'
                                        }}
                                        itemStyle={{ color: '#00ffff' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="price"
                                        stroke="#00ffff"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorPrice)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Prediction Results */}
                    <AnimatePresence>
                        {isPredicting && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-card p-10 rounded-3xl border-neon-cyan/30 flex flex-col items-center justify-center text-center"
                            >
                                <div className="relative">
                                    <div className="w-20 h-20 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
                                    <Cpu className="absolute inset-0 m-auto w-8 h-8 text-neon-cyan animate-pulse" />
                                </div>
                                <h3 className="mt-6 text-xl font-bold text-white tracking-tight">Analyzing Market Data with AI...</h3>
                                <p className="text-slate-400 mt-2">Computing RSI, Moving Averages and Regression Models</p>
                            </motion.div>
                        )}

                        {prediction && !isPredicting && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-12 gap-6"
                            >
                                <div className="md:col-span-4 glass-card p-6 rounded-3xl border-neon-cyan/50 bg-neon-cyan/5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <TrendingUp className="w-24 h-24 text-neon-cyan" />
                                    </div>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-black mb-1">AI Predicted Price</p>
                                    <h4 className="text-4xl font-mono font-black text-neon-cyan">${prediction.predictedPrice}</h4>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-300">Confidence Score:</span>
                                        <span className="text-lg font-black text-white">{prediction.confidence}%</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${prediction.confidence}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-neon-cyan"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-8 glass-card p-6 rounded-3xl border-white/10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${prediction.trend === 'Bullish' ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
                                            {prediction.trend.toUpperCase()} SIGNAL
                                        </div>
                                    </div>
                                    <h5 className="text-white font-bold mb-2">AI Insights Summary</h5>
                                    <p className="text-slate-400 text-sm leading-relaxed italic">
                                        "{prediction.insight}"
                                    </p>
                                    <div className="mt-4 flex gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">7-Day Forecast</span>
                                            <div className="flex gap-2 mt-1">
                                                {prediction.forecast.map((p, i) => (
                                                    <div key={i} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-mono border border-white/5">
                                                        ${Math.floor(p)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;

/**
 * Mock Stock Service for QuantumStock AI
 */

const SYMBOLS = ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'RELIANCE.NS', 'TCS.NS', 'NVDA'];

const COMPANY_NAMES = {
    'AAPL': 'Apple Inc.',
    'TSLA': 'Tesla, Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com, Inc.',
    'RELIANCE.NS': 'Reliance Industries Ltd.',
    'TCS.NS': 'Tata Consultancy Services',
    'NVDA': 'NVIDIA Corporation'
};

/**
 * Generates mock historical data for the last 30 days
 */
export const generateHistory = (symbol) => {
    const data = [];
    const now = new Date();
    let basePrice = 150 + Math.random() * 500;

    for (let i = 30; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Simulate some volatility
        const change = (Math.random() - 0.5) * 10;
        basePrice += change;

        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: parseFloat(basePrice.toFixed(2)),
            volume: Math.floor(Math.random() * 1000000) + 500000
        });
    }
    return data;
};

/**
 * Basic Linear Regression for price prediction
 */
const predictLinear = (history) => {
    const n = history.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

    history.forEach((d, i) => {
        sumX += i;
        sumY += d.price;
        sumXY += i * d.price;
        sumXX += i * i;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const predictions = [];
    const lastPrice = history[history.length - 1].price;

    for (let i = 1; i <= 7; i++) {
        const predicted = slope * (n + i) + intercept;
        predictions.push(parseFloat(predicted.toFixed(2)));
    }

    return predictions;
};

/**
 * Calculate RSI (Relative Strength Index)
 */
const calculateRSI = (history) => {
    let gains = 0;
    let losses = 0;

    for (let i = 1; i < history.length; i++) {
        const diff = history[i].price - history[i - 1].price;
        if (diff >= 0) gains += diff;
        else losses -= diff;
    }

    const avgGain = gains / history.length;
    const avgLoss = losses / history.length;

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 * rs));
};

export const getPrediction = async (symbol, history) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const linearPredictions = predictLinear(history);
    const rsi = calculateRSI(history);
    const lastPrice = history[history.length - 1].price;
    const predictedEndPrice = linearPredictions[6];

    const change = ((predictedEndPrice - lastPrice) / lastPrice) * 100;
    const trend = change > 0 ? 'Bullish' : 'Bearish';
    const confidence = Math.floor(70 + Math.random() * 25);

    let insight = '';
    if (trend === 'Bullish') {
        insight = `Analysis of ${symbol} suggests a positive breakout. RSI at ${rsi.toFixed(1)} indicates healthy momentum with room for growth. Volume patterns confirm institutional interest.`;
    } else {
        insight = `Market indicators for ${symbol} show potential consolidation or slight correction. Moving averages suggest resistance at current levels. Caution advised for short-term positions.`;
    }

    return {
        forecast: linearPredictions,
        trend,
        confidence,
        insight,
        predictedPrice: predictedEndPrice
    };
};

export const getStockDetails = (symbol) => {
    return {
        name: COMPANY_NAMES[symbol] || symbol,
        marketCap: (Math.random() * 2.5).toFixed(2) + 'T',
        volume: (Math.random() * 50).toFixed(1) + 'M',
        change: (Math.random() * 4 - 2).toFixed(2)
    };
};

export { SYMBOLS };

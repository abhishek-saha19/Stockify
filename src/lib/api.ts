
const API_KEY = process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY;

export interface RealStockData {
    price: number;
    change: number;
    changePercent: number;
}

export const fetchStockPrice = async (symbol: string, exchange: string = "NSE"): Promise<RealStockData | null> => {
    if (!API_KEY) {
        console.warn("Twelve Data API Key missing");
        return null;
    }

    try {
        const hasKey = !!API_KEY;
        console.log(`[API] Fetching ${symbol} from Twelve Data`);

        // Twelve Data Endpoint
        // symbol: TICKER (e.g., RELIANCE)
        // exchange: NSE
        // apikey: ...
        const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&exchange=${exchange}&country=India&apikey=${API_KEY}`);

        if (!response.ok) {
            console.warn(`[API] Failed to fetch ${symbol}: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();

        // Twelve Data Error Check
        if (data.status === "error" || !data.close) {
            console.warn(`[API] Error for ${symbol}:`, data.message);
            return null;
        }

        return {
            price: parseFloat(data.close),
            // 'change' and 'percent_change' are strings in Twelve Data JSON
            change: parseFloat(data.change),
            changePercent: parseFloat(data.percent_change)
        };
    } catch (error) {
        console.error("[API] Network error fetching stock data:", error);
        return null;
    }
};


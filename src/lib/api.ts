
const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

export interface RealStockData {
    price: number;
    change: number;
    changePercent: number;
}

export const fetchStockPrice = async (symbol: string): Promise<RealStockData | null> => {
    // Finnhub uses 'RELIANCE.NS' format for NSE usually, or just 'AAPL' for US
    if (!API_KEY) {
        console.warn("Finnhub API Key missing");
        return null;
    }

    try {
        // Debugging: Check if key is loaded (do not log the full key)
        const hasKey = !!API_KEY;
        const maskedKey = hasKey ? `${API_KEY?.substring(0, 3)}...` : "MISSING";

        console.log(`[API] Fetching ${symbol} | Key status: ${hasKey ? "Present" : "Missing"} (${maskedKey})`);

        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);

        if (!response.ok) {
            // Log the specific error status (401 = Unauthorized, 403 = Forbidden, 429 = Rate Limit)
            console.warn(`[API] Failed to fetch ${symbol}: ${response.status} ${response.statusText}`);
            // Return null so the UI can fallback to mock data instead of crashing/showing error overlay
            return null;
        }

        const data = await response.json();

        // Finnhub Quote Response:
        // c: Current price
        // d: Change
        // dp: Percent change
        // If data.c is 0, it usually means symbol not found or free tier limit
        if (data.c === 0 && data.d === null) {
            console.log(`[API] Symbol ${symbol} returned empty/zero data. Likely invalid symbol for this plan.`);
            return null;
        }

        return {
            price: data.c,
            change: data.d,
            changePercent: data.dp
        };
    } catch (error) {
        console.error("[API] Network error fetching stock data:", error);
        return null;
    }
};


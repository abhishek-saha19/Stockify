


export interface RealStockData {
    price: number;
    change: number;
    changePercent: number;
}

export const fetchStockPrice = async (symbol: string, exchange: string = "NSE"): Promise<RealStockData | null> => {
    try {
        console.log(`[API] Fetching ${symbol} via secure proxy`);

        // Call our own internal API route (Proxy)
        const response = await fetch(`/api/price?symbol=${symbol}&exchange=${exchange}`);

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


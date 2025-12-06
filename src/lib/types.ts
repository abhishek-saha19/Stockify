export interface Stock {
    id: number;
    symbol: string;
    name: string;
    sector: string;
    exchange: string;
    price: number;
    changePercent: number;
    marketCap: string;
    peRatio: number;
    volume: number;
    volatility: "Low" | "Medium" | "High";
    oneYearReturn: number;
    description: string;
    sectorTag?: string;
    isFno?: boolean;
    riskLabel?: string;
}

export type SwipeAction = "like" | "dislike";

export interface WatchlistItem extends Stock {
    addedAt: number;
}

"use client";

import { useEffect, useState } from "react";
import { STOCKS } from "@/lib/data";
import { Stock } from "@/lib/types";
import { WatchlistTable } from "@/components/feature/WatchlistTable";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useAuth } from "@/context/AuthContext";
import { WatchlistService } from "@/lib/firestore";
// ... imports

export default function WatchlistPage() {
    const { user, loading } = useAuth(); // Use new AuthContext
    const [watchlistStocks, setWatchlistStocks] = useState<Stock[]>([]);
    const [sortOrder, setSortOrder] = useState<string>("default");

    useEffect(() => {
        if (loading) return;
        if (!user) return;

        const fetchWatchlist = async () => {
            const data = await WatchlistService.getWatchlist(user.uid);

            // Fetch real prices for each stock in the watchlist
            // Finnhub Free Tier Limit ~60 calls/min. Watchlist usually < 10 items.
            // We fetch in parallel but might need to be careful.
            const updatedDataPromises = data.map(async (stock) => {
                let querySymbol = stock.symbol;
                // Generalize mapping: If exchange is NSE and doesn't already have extension
                if (stock.exchange === "NSE" && !querySymbol.endsWith(".NS")) {
                    querySymbol = `${stock.symbol}.NS`;
                }

                // Fallback to mock if API fails
                try {
                    const { fetchStockPrice } = await import("@/lib/api");
                    const realData = await fetchStockPrice(querySymbol);
                    if (realData) {
                        return {
                            ...stock,
                            price: realData.price,
                            changePercent: realData.changePercent
                        };
                    }
                } catch (e) {
                    console.error("Failed to fetch price for", stock.symbol);
                }
                return stock;
            });

            const realStocks = await Promise.all(updatedDataPromises);
            setWatchlistStocks(realStocks);
        };
        fetchWatchlist();
    }, [user, loading]);

    const handleRemove = async (id: number) => {
        if (!user) return;

        // Optimistic update
        const updatedStocks = watchlistStocks.filter((s) => s.id !== id);
        setWatchlistStocks(updatedStocks);

        await WatchlistService.removeFromWatchlist(user.uid, id);
        toast.success("Stock removed");
    };

    const getSortedStocks = () => {
        let sorted = [...watchlistStocks];
        switch (sortOrder) {
            case "price-asc":
                return sorted.sort((a, b) => a.price - b.price);
            case "price-desc":
                return sorted.sort((a, b) => b.price - a.price);
            case "change-desc":
                return sorted.sort((a, b) => b.changePercent - a.changePercent);
            default:
                return sorted;
        }
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Your Watchlist</h1>
                    <p className="text-muted-foreground">Track your favorite stocks.</p>
                </div>

                <Select onValueChange={setSortOrder} defaultValue="default">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="change-desc">Change: High to Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-4 bg-card border rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Stocks</p>
                    <p className="text-2xl font-bold">{watchlistStocks.length}</p>
                </div>
                {/* Add more summaries if needed */}
            </div>

            <WatchlistTable stocks={getSortedStocks()} onRemove={handleRemove} />
        </div>
    );
}

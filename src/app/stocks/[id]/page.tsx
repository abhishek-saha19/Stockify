"use client";

import { STOCKS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Eye } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation"; // Added import

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StockChart } from "@/components/feature/StockChart";
import { AddToWatchlistButton } from "@/components/feature/AddToWatchlistButton";
import { fetchStockPrice } from "@/lib/api"; // Added import

export default function StockDetailsPage() {
    const params = useParams();
    const initialStock = STOCKS.find((s) => s.id === Number(params.id));
    const [stock, setStock] = useState(initialStock);

    useEffect(() => {
        const getRealData = async () => {
            if (!stock) return;
            // Map common Indian stocks to US symbols for demo purposes if needed, 
            // or try direct NSE symbols if Finnhub supports them on your plan.
            // For free tier reliability, let's map a few for the Resume Demo:
            let querySymbol = stock.symbol;
            if (stock.symbol === "RELIANCE") querySymbol = "RELIANCE.NS";
            if (stock.symbol === "TCS") querySymbol = "TCS.NS";
            // ... add more mappings or just pass stock.symbol

            // NOTE: Finnhub Free Tier often lacks NSE data. 
            // FALLBACK: If you want to impress, use "AAPL" for technology stocks just to show it works, 
            // or stick to the mocking if the API returns 0.

            const realData = await fetchStockPrice(querySymbol);
            if (realData) {
                setStock(prev => {
                    if (!prev) return undefined; // Should not happen given check above
                    return {
                        ...prev,
                        price: realData.price,
                        changePercent: realData.changePercent
                    };
                });
            }
        };
        getRealData();
    }, []);

    if (!stock) {
        return <div className="p-8 text-center bg-background text-foreground min-h-screen">Stock not found</div>;
    }

    const isPositive = stock.changePercent >= 0;

    return (
        <div className="flex flex-col h-full bg-background pb-20 md:pb-4">
            <div className="p-4 border-b flex items-center gap-4 sticky top-0 bg-background z-10">
                <Link href="/market">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="font-bold text-lg">{stock.symbol}</h1>
                    <p className="text-xs text-muted-foreground">{stock.exchange}</p>
                </div>
            </div>

            <div className="p-4 space-y-6 overflow-auto">
                {/* Header Section */}
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-muted-foreground">{stock.name}</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-bold">₹{stock.price}</span>
                            <span className={cn("text-sm font-medium flex items-center", isPositive ? "text-green-500" : "text-red-500")}>
                                {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                {stock.changePercent}%
                            </span>
                        </div>
                    </div>
                    <Badge>{stock.sector}</Badge>
                </div>

                {/* Chart Section */}
                <div className="w-full">
                    <StockChart
                        symbol={stock.symbol}
                        basePrice={stock.price}
                        isPositive={isPositive}
                    />
                </div>

                {/* Time Periods (Mock) */}
                <div className="flex justify-between md:justify-start md:gap-4">
                    {["1D", "1W", "1M", "1Y", "5Y", "All"].map((p) => (
                        <Button key={p} variant={p === "1D" ? "secondary" : "ghost"} size="sm" className="rounded-full h-8 text-xs font-medium">
                            {p}
                        </Button>
                    ))}
                </div>

                <Separator />

                {/* Key Metrics */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Market Stats</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                        <Metric label="Market Cap" value={stock.marketCap} />
                        <Metric label="P/E Ratio" value={stock.peRatio.toString()} />
                        <Metric label="Volume" value={stock.volume.toLocaleString()} />
                        <Metric label="52W High" value={`₹${(stock.price * 1.2).toFixed(2)} `} />
                        <Metric label="52W Low" value={`₹${(stock.price * 0.8).toFixed(2)} `} />
                        <Metric label="Volatility" value={stock.volatility} />
                    </div>
                </div>

                <Separator />

                {/* About */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">About {stock.symbol}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {stock.description}
                    </p>
                    <div className="mt-4 flex gap-2">
                        {stock.sectorTag && <Badge variant="secondary">{stock.sectorTag}</Badge>}
                        {stock.riskLabel && <Badge variant="outline">Risk: {stock.riskLabel}</Badge>}
                    </div>
                </div>

            </div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-16 md:bottom-4 left-0 right-0 p-4 bg-background border-t md:border md:rounded-lg md:max-w-md md:mx-auto md:relative md:bottom-auto">
                <AddToWatchlistButton stockId={stock.id} symbol={stock.symbol} />
            </div>
        </div>
    );
}

function Metric({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    )
}

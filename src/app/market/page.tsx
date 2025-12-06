"use client";

import { useState } from "react";
import { STOCKS } from "@/lib/data";
import { StockCard } from "@/components/feature/StockCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function MarketPage() {
    const [search, setSearch] = useState("");

    const filteredStocks = STOCKS.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.symbol.toLowerCase().includes(search.toLowerCase())
    );

    const gainers = [...STOCKS].sort((a, b) => b.changePercent - a.changePercent).slice(0, 10);
    const losers = [...STOCKS].sort((a, b) => a.changePercent - b.changePercent).slice(0, 10);

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Market Overview</h1>
                <Input
                    placeholder="Search market..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md"
                />
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">All Stocks</TabsTrigger>
                    <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
                    <TabsTrigger value="losers">Top Losers</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {filteredStocks.map(stock => (
                            <MarketStockCard key={stock.id} stock={stock} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="gainers" className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {gainers.map(stock => (
                            <MarketStockCard key={stock.id} stock={stock} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="losers" className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {losers.map(stock => (
                            <MarketStockCard key={stock.id} stock={stock} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Simplified card for market grid
function MarketStockCard({ stock }: { stock: any }) {
    const isPositive = stock.changePercent >= 0;
    return (
        <Link href={`/stocks/${stock.id}`}>
            <Card className="hover:bg-secondary/50 transition-colors">
                <CardContent className="p-4">
                    <div className="font-bold">{stock.symbol}</div>
                    <div className="text-xs text-muted-foreground truncate">{stock.name}</div>
                    <div className="flex justify-between items-end mt-2">
                        <div className="font-semibold">₹{stock.price}</div>
                        <div className={cn("text-xs font-medium", isPositive ? "text-green-500" : "text-red-500")}>
                            {stock.changePercent}%
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

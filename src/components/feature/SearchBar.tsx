"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { STOCKS } from "@/lib/data";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();

    const filteredStocks = useMemo(() => {
        if (!query.trim()) return [];
        const lowerQuery = query.toLowerCase();
        return STOCKS.filter(stock =>
            stock.symbol.toLowerCase().includes(lowerQuery) ||
            stock.name.toLowerCase().includes(lowerQuery) ||
            stock.sector.toLowerCase().includes(lowerQuery)
        ).slice(0, 5); // Limit to top 5
    }, [query]);

    const handleSelect = (stockId: number) => {
        router.push(`/stocks/${stockId}`);
        setQuery("");
        setIsFocused(false);
    };

    return (
        <div className="relative w-full max-w-md ml-0 md:ml-4 z-50">
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search stocks, sectors..."
                    className="pl-8 pr-8 bg-secondary/50 border-transparent focus:border-primary transition-all"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow click
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery("");
                            setIsFocused(true);
                        }}
                        className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {isFocused && query && (
                <Card className="absolute top-full mt-2 left-0 w-full bg-card shadow-xl border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="max-h-[300px] overflow-auto py-2">
                        {filteredStocks.length > 0 ? (
                            filteredStocks.map((stock) => (
                                <div
                                    key={stock.id}
                                    className="px-4 py-3 hover:bg-secondary/50 cursor-pointer transition-colors flex justify-between items-center"
                                    onClick={() => handleSelect(stock.id)}
                                >
                                    <div>
                                        <p className="font-bold text-sm">{stock.symbol}</p>
                                        <p className="text-xs text-muted-foreground">{stock.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-sm">₹{stock.price}</p>
                                        <Badge variant="outline" className="text-[10px] h-5">{stock.sector}</Badge>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-center text-sm text-muted-foreground">
                                No results found.
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
}

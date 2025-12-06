import Link from "next/link";
import { Stock } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StockCardProps {
    stock: Stock;
}

export function StockCard({ stock }: StockCardProps) {
    const isPositive = stock.changePercent >= 0;

    return (
        <Link href={`/stocks/${stock.id}`}>
            <Card className="w-[160px] h-full shrink-0 hover:bg-card transition-all duration-300 cursor-pointer border border-border/50 bg-card shadow-md hover:shadow-xl hover:-translate-y-1 group">
                <CardContent className="p-4 flex flex-col h-full justify-between">
                    <div>
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                            <span className="text-xs font-bold text-primary">{stock.symbol.substring(0, 2)}</span>
                        </div>
                        <h3 className="font-bold text-sm truncate text-foreground group-hover:text-primary transition-colors" title={stock.name}>
                            {stock.symbol}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
                    </div>
                    <div className="mt-2">
                        <p className="font-medium text-sm">₹{stock.price.toFixed(2)}</p>
                        <span
                            className={cn(
                                "text-xs font-medium",
                                isPositive ? "text-green-500" : "text-red-500"
                            )}
                        >
                            {isPositive ? "+" : ""}
                            {stock.changePercent.toFixed(2)}%
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

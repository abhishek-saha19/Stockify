"use client";

import Link from "next/link";
import { Stock } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface WatchlistTableProps {
    stocks: Stock[];
    onRemove: (id: number) => void;
}

export function WatchlistTable({ stocks, onRemove }: WatchlistTableProps) {
    return (
        <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Symbol</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Change</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stocks.map((stock) => {
                        const isPositive = stock.changePercent >= 0;
                        return (
                            <TableRow key={stock.id} className="cursor-pointer hover:bg-secondary/40 transition-colors">
                                <TableCell className="font-medium">
                                    <Link href={`/stocks/${stock.id}`} className="hover:underline">
                                        {stock.symbol}
                                    </Link>
                                </TableCell>
                                <TableCell>{stock.name}</TableCell>
                                <TableCell className="text-right">
                                    {(stock.exchange === "NASDAQ" || stock.exchange === "NYSE") ? "$" : "₹"}
                                    {stock.price.toFixed(2)}
                                </TableCell>
                                <TableCell className={cn("text-right flex justify-end items-center gap-1", isPositive ? "text-green-500" : "text-red-500")}>
                                    {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                    {stock.changePercent.toFixed(2)}%
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => onRemove(stock.id)}>
                                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {stocks.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                Your watchlist is empty. Swipe some stocks in Discover!
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

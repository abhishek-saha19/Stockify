"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";


interface AddToWatchlistButtonProps {
    stockId: number;
    symbol: string;
}

import { useAuth } from "@/context/AuthContext";
import { WatchlistService } from "@/lib/firestore";
import { STOCKS } from "@/lib/data"; // Import mock data to get full stock object if needed

// ... inside component
export function AddToWatchlistButton({ stockId, symbol }: AddToWatchlistButtonProps) {
    const [isAdded, setIsAdded] = useState(false);
    const { user, loading } = useAuth();

    useEffect(() => {
        if (user) {
            WatchlistService.getWatchlist(user.uid).then(stocks => {
                if (stocks.some(s => s.id === stockId)) {
                    setIsAdded(true);
                }
            });
        } else {
            setIsAdded(false);
        }
    }, [stockId, user]);

    const handleAdd = async () => {
        if (!user) {
            toast.error("Please login to add to watchlist");
            return;
        }

        const stock = STOCKS.find(s => s.id === stockId);
        if (!stock) return;

        try {
            const success = await WatchlistService.addToWatchlist(user.uid, stock);
            if (success) {
                setIsAdded(true);
                toast.success(
                    <div className="flex items-center gap-2">
                        Stock Added to Watchlist
                    </div>,
                    {
                        icon: <CheckCircle2 className="text-green-500" />
                    }
                );
            } else {
                toast.info("Stock already in watchlist");
            }
        } catch (error) {
            toast.error("Error adding to watchlist");
        }
    };

    return (
        <Button
            className="w-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all"
            onClick={handleAdd}
            disabled={isAdded}
        >
            {isAdded ? (
                <>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Added to Watchlist
                </>
            ) : (
                <>
                    <Plus className="mr-2 h-4 w-4" /> Add to Watchlist
                </>
            )}
        </Button>
    );
}

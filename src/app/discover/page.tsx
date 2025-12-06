"use client";

import { useState, useEffect } from "react";
import { STOCKS } from "@/lib/data";
import { Stock, SwipeAction } from "@/lib/types";
import { SwipeableCard } from "@/components/feature/SwipeableCard";
import { Button } from "@/components/ui/button";
import { RotateCcw, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { WatchlistService } from "@/lib/firestore";
// ... imports

export default function DiscoverPage() {
    const { user } = useAuth();
    const [stockQueue, setStockQueue] = useState<Stock[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

    useEffect(() => {
        // Initialize queue
        // In a real app, we might fetch user's watchlist first to filter out seen stocks
        setStockQueue([...STOCKS].sort(() => Math.random() - 0.5));
    }, []);

    const handleSwipe = async (direction: "left" | "right") => {
        const currentStock = stockQueue[currentIndex];

        setCurrentIndex((prev) => prev + 1);

        if (direction === "right") {
            // Add to watchlist
            console.log(`Liked ${currentStock.symbol}`);
            if (user) {
                const success = await WatchlistService.addToWatchlist(user.uid, currentStock);

                // Show toast
                toast.success(
                    <div className="flex items-center gap-2">
                        {success ? "Stock Added to Watchlist" : "Already in Watchlist"}
                    </div>,
                    {
                        icon: <CheckCircle2 className="text-green-500" />
                    }
                );
            } else {
                toast.info("Login to save to watchlist", {
                    action: {
                        label: "Login",
                        onClick: () => router.push("/login")
                    }
                });
            }
        } else {
            console.log(`Disliked ${currentStock.symbol}`);
        }
    };

    const resetDiscovery = () => {
        setStockQueue([...STOCKS].sort(() => Math.random() - 0.5));
        setCurrentIndex(0);
    };

    if (stockQueue.length === 0) return null; // Loading state

    const isFinished = currentIndex >= stockQueue.length;

    return (
        <div className="flex h-full flex-col items-center justify-center p-4 relative overflow-hidden">
            {!isFinished ? (
                <div className="relative w-full max-w-sm h-full flex items-center justify-center">
                    {/* Render current card */}
                    <SwipeableCard
                        key={stockQueue[currentIndex].id}
                        stock={stockQueue[currentIndex]}
                        onSwipe={handleSwipe}
                    />
                    {/* Render next card in background for better UX (optional, simplistic here) */}
                    {currentIndex + 1 < stockQueue.length && (
                        <div className="absolute left-0 right-0 top-0 bottom-0 m-auto w-full max-w-sm flex items-center justify-center -z-10">
                            <div className="w-full h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] bg-card border rounded-xl shadow-lg scale-95 opacity-50"></div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold">You've explored all stocks!</h2>
                    <p className="text-muted-foreground">Check your watchlist or start over.</p>
                    <div className="flex flex-col gap-2">
                        <Button onClick={() => router.push("/watchlist")}>Go to Watchlist</Button>
                        <Button variant="outline" onClick={resetDiscovery}>
                            <RotateCcw className="mr-2 h-4 w-4" /> Start Over
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

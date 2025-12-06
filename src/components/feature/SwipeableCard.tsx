"use client";

import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { Stock } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwipeableCardProps {
    stock: Stock;
    onSwipe: (direction: "left" | "right") => void;
}

export function SwipeableCard({ stock, onSwipe }: SwipeableCardProps) {
    const controls = useAnimation();
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-100, 0, 100], [-10, 0, 10]);
    const opacity = useTransform(x, [-150, -100, 0, 100, 150], [0, 1, 1, 1, 0]);

    // Color overlays based on swipe direction
    const rightOpacity = useTransform(x, [0, 100], [0, 1]);
    const leftOpacity = useTransform(x, [-100, 0], [1, 0]);

    const handleDragEnd = async (_: any, info: any) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (offset > 100 || velocity > 500) {
            await controls.start({ x: 500, opacity: 0 });
            onSwipe("right");
        } else if (offset < -100 || velocity < -500) {
            await controls.start({ x: -500, opacity: 0 });
            onSwipe("left");
        } else {
            controls.start({ x: 0, opacity: 1 });
        }
    };

    const swipe = async (direction: "left" | "right") => {
        if (direction === "right") {
            await controls.start({ x: 500, opacity: 0, rotate: 10, transition: { duration: 0.2 } });
        } else {
            await controls.start({ x: -500, opacity: 0, rotate: -10, transition: { duration: 0.2 } });
        }
        onSwipe(direction);
    };

    const isPositive = stock.changePercent >= 0;

    return (
        <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={controls}
            initial={{ scale: 0.95, opacity: 0.5 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ x, rotate, opacity }}
            className="absolute left-0 right-0 top-0 bottom-0 m-auto w-full max-w-sm h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] cursor-grab active:cursor-grabbing"
        >
            {/* ... overlays ... */}
            {/* Like Overlay */}
            <motion.div
                style={{ opacity: rightOpacity }}
                className="absolute top-8 left-8 z-20 border-4 border-green-500 rounded-lg p-2 transform -rotate-12"
            >
                <ThumbsUp className="h-12 w-12 text-green-500" />
            </motion.div>

            {/* Dislike Overlay */}
            <motion.div
                style={{ opacity: leftOpacity }}
                className="absolute top-8 right-8 z-20 border-4 border-red-500 rounded-lg p-2 transform rotate-12"
            >
                <ThumbsDown className="h-12 w-12 text-red-500" />
            </motion.div>

            <Card className="h-full w-full bg-card shadow-2xl border-2 border-border/60 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                <CardHeader className="pb-0 pt-4 text-center shrink-0">
                    <Badge variant="outline" className="mb-1 w-fit mx-auto px-2 py-0 h-5 text-[10px]">{stock.sector}</Badge>
                    <CardTitle className="text-2xl font-bold leading-tight">{stock.symbol}</CardTitle>
                    <CardDescription className="text-sm">{stock.name}</CardDescription>
                    <div className="flex justify-center items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold">₹{stock.price}</span>
                        <span className={cn("text-sm font-medium flex items-center", isPositive ? "text-green-500" : "text-red-500")}>
                            {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                            {Math.abs(stock.changePercent)}%
                        </span>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between pt-2 pb-4 px-4 overflow-hidden">
                    <div className="flex-1 flex flex-col justify-start space-y-3 overflow-hidden">
                        <div className="grid grid-cols-2 gap-2 text-center shrink-0">
                            <div className="bg-secondary/30 p-2 rounded-lg">
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Market Cap</p>
                                <p className="font-semibold text-sm">{stock.marketCap}</p>
                            </div>
                            <div className="bg-secondary/30 p-2 rounded-lg">
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">P/E Ratio</p>
                                <p className="font-semibold text-sm">{stock.peRatio}</p>
                            </div>
                            <div className="bg-secondary/30 p-2 rounded-lg">
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Volatility</p>
                                <p className="font-semibold text-sm">{stock.volatility}</p>
                            </div>
                            <div className="bg-secondary/30 p-2 rounded-lg">
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">1Y Return</p>
                                <p className={cn("font-semibold text-sm", stock.oneYearReturn >= 0 ? "text-green-500" : "text-red-500")}>
                                    {stock.oneYearReturn}%
                                </p>
                            </div>
                        </div>

                        <div className="bg-secondary/20 p-3 rounded-xl overflow-hidden flex-1 flex items-center justify-center">
                            <p className="text-xs italic leading-relaxed text-muted-foreground text-center line-clamp-[8]">
                                "{stock.description}"
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-3 text-center shrink-0">
                        <Button
                            variant="outline"
                            size="default"
                            className="flex-1 h-12 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all text-sm font-semibold shadow-md"
                            onClick={(e) => {
                                e.stopPropagation();
                                swipe("left");
                            }}
                        >
                            <ThumbsDown className="mr-2 h-4 w-4" /> Not Interested
                        </Button>
                        <Button
                            variant="outline"
                            size="default"
                            className="flex-1 h-12 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all text-sm font-semibold shadow-md"
                            onClick={(e) => {
                                e.stopPropagation();
                                swipe("right");
                            }}
                        >
                            <ThumbsUp className="mr-2 h-4 w-4" /> Interested
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis, XAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";

interface StockChartProps {
    symbol: string;
    basePrice: number;
    isPositive: boolean;
}

export function StockChart({ symbol, basePrice, isPositive }: StockChartProps) {
    const [data, setData] = useState<{ time: string; price: number }[]>([]);
    const { theme } = useTheme();

    useEffect(() => {
        // Simulate intraday data (e.g., 9:15 AM to 3:30 PM)
        const generateData = () => {
            const points = [];
            let currentPrice = basePrice; // Start from close/current price and work backwards or volatility

            // 50 Simulation points
            for (let i = 0; i < 50; i++) {
                points.push({
                    time: `${9 + Math.floor(i * 0.15)}:${(i * 10) % 60 < 10 ? '0' : ''}${(i * 10) % 60}`,
                    price: currentPrice
                });
                // Random walk
                const change = (Math.random() - 0.5) * (basePrice * 0.01);
                currentPrice += change;
            }
            return points.reverse(); // Just to make graph look somewhat realistic relative to 'now'
        };

        setData(generateData());
    }, [basePrice]);

    const color = isPositive ? "#22c55e" : "#ef4444"; // green-500 : red-500

    return (
        <Card className="h-64 w-full bg-card/50 border-input p-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="time"
                        hide
                    />
                    <YAxis
                        domain={['auto', 'auto']}
                        hide
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                            color: "hsl(var(--foreground))"
                        }}
                        itemStyle={{ color: color }}
                    />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke={color}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
}

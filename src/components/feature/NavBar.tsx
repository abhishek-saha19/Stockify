"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, List, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Discover", icon: Compass, href: "/discover" },
    { label: "Watchlist", icon: List, href: "/watchlist" },
    { label: "Market", icon: BarChart2, href: "/market" },
];

export function NavBar() {
    const pathname = usePathname();

    return (
        <>
            {/* Desktop Sidebar */}
            <nav className="hidden md:flex flex-col w-64 border-r bg-card p-4 h-screen sticky top-0">
                <div className="mb-8 px-2">
                    <h1 className="text-2xl font-bold text-primary">Stockify</h1>
                </div>
                <div className="space-y-4">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-secondary text-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Mobile Bottom Tab Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background p-2 z-50 flex justify-around items-center h-16 safe-area-bottom">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 w-full h-full text-xs font-medium transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("h-6 w-6", isActive && "fill-current")} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}

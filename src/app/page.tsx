import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/feature/SearchBar";
import { UserMenu } from "@/components/feature/UserMenu";
import Link from "next/link";
import { StockCarousel } from "@/components/feature/StockCarousel";
import { STOCKS } from "@/lib/data";

// Helper to filter/sort stocks for different sections
const trendingStocks = STOCKS.slice(0, 10);
const topGainers = [...STOCKS].sort((a, b) => b.changePercent - a.changePercent).slice(0, 10);
const bankingStocks = STOCKS.filter(s => s.sector === "Banking" || s.sector === "Finance");
const itStocks = STOCKS.filter(s => s.sector === "IT Services");

export default function Home() {
    return (
        <div className="flex flex-col h-full bg-background text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b md:border-none">
                <h1 className="text-xl font-bold tracking-tight text-green-500 md:hidden">Stockify</h1>
                <SearchBar />
                <UserMenu />
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-4 space-y-8 pb-20 md:pb-4">
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold tracking-tight">Trending Stocks</h2>
                        <Link href="/market" className="text-sm font-medium text-muted-foreground hover:text-primary">
                            See all
                        </Link>
                    </div>
                    <StockCarousel stocks={trendingStocks} />
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold tracking-tight">Top Gainers Today</h2>
                        <Link href="/market" className="text-sm font-medium text-muted-foreground hover:text-primary">
                            See all
                        </Link>
                    </div>
                    <StockCarousel stocks={topGainers} />
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold tracking-tight">Banking & Finance Picks</h2>
                        <Link href="/market" className="text-sm font-medium text-muted-foreground hover:text-primary">
                            See all
                        </Link>
                    </div>
                    <StockCarousel stocks={bankingStocks} />
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold tracking-tight">IT Sector</h2>
                        <Link href="/market" className="text-sm font-medium text-muted-foreground hover:text-primary">
                            See all
                        </Link>
                    </div>
                    <StockCarousel stocks={itStocks} />
                </section>
            </main>
        </div>
    );
}

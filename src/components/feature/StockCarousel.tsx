import { Stock } from "@/lib/types";
import { StockCard } from "./StockCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface StockCarouselProps {
    stocks: Stock[];
}

export function StockCarousel({ stocks }: StockCarouselProps) {
    return (
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex w-max space-x-4 p-1 pb-4">
                {stocks.map((stock) => (
                    <StockCard key={stock.id} stock={stock} />
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}

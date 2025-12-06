import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from "firebase/firestore";
import { Stock } from "@/lib/types";

// Helper to sanitize stock object for Firestore (remove undefined/optional if needed, mostly for safety)
// In this case, saving valid stock IDs or minimal objects is often enough, but user asked for stocks array.
// We'll store the full object to avoid lookup complexity, or maybe just ID if data is static.
// Let's store a simplified version + ID to be efficient, or full if small. The mock data is small.

export const WatchlistService = {
    async getWatchlist(userId: string): Promise<Stock[]> {
        try {
            const docRef = doc(db, "watchlists", userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data().stocks || [];
            } else {
                return [];
            }
        } catch (error) {
            console.error("Error fetching watchlist:", error);
            return [];
        }
    },

    async addToWatchlist(userId: string, stock: Stock): Promise<boolean> {
        try {
            const docRef = doc(db, "watchlists", userId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                // Create document if doesn't exist
                await setDoc(docRef, { stocks: [stock] });
            } else {
                // Check if already exists to avoid duplication if arrayUnion relies on object equality
                // ArrayUnion works by content. If stock object changes (price), it might duplicate?
                // Better to check by ID first manually or treat it as overwrite.

                // Let's rely on arrayUnion unique constraint for exact object match.
                // However, stock prices change. So we should probably check ID.
                const currentStocks = docSnap.data().stocks as Stock[] || [];
                if (currentStocks.some(s => s.id === stock.id)) {
                    return false; // Already present
                }

                await updateDoc(docRef, {
                    stocks: arrayUnion(stock)
                });
            }
            return true;
        } catch (error) {
            console.error("Error adding to watchlist:", error);
            return false;
        }
    },

    async removeFromWatchlist(userId: string, stockId: number): Promise<boolean> {
        try {
            const docRef = doc(db, "watchlists", userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const currentStocks = docSnap.data().stocks as Stock[] || [];
                const stockToRemove = currentStocks.find(s => s.id === stockId);

                if (stockToRemove) {
                    await updateDoc(docRef, {
                        stocks: arrayRemove(stockToRemove)
                    });
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error("Error removing from watchlist:", error);
            return false;
        }
    }
};

import { AuthProvider } from "@/context/AuthContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/feature/NavBar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Stockify",
    description: "Modern Stock Analysis App",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <AuthProvider>
                    <div className="flex h-screen w-full overflow-hidden flex-col md:flex-row bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-background to-secondary/30 text-foreground">
                        <NavBar />
                        <div className="flex-1 h-full overflow-auto pb-16 md:pb-0">
                            {children}
                        </div>
                        <Toaster position="bottom-right" richColors />
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}

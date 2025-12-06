"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Settings, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserMenu() {
    const { user, loading, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully");
        setIsOpen(false);
    };

    if (loading) {
        return <div className="w-10 h-10 rounded-full bg-secondary/50 animate-pulse ml-2" />;
    }

    if (!user) {
        return (
            <div className="flex gap-2 ml-2">
                <Link href="/login">
                    <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/signup">
                    <Button size="sm">Sign Up</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="relative ml-2" ref={menuRef}>
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative p-0 overflow-hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                    <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
            </Button>

            {isOpen && (
                <Card className="absolute right-0 mt-1 w-56 z-50 animate-in fade-in zoom-in-95 duration-150 shadow-xl border-border/50 bg-popover text-popover-foreground">
                    <div className="px-3 py-2 border-b border-border/50">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs text-muted-foreground truncate mt-1">{user.email}</p>
                    </div>
                    <div className="p-1">
                        <Link href="/profile" onClick={() => setIsOpen(false)}>
                            <div className="flex items-center px-3 py-1.5 text-sm rounded-md hover:bg-secondary/50 cursor-pointer transition-colors">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </div>
                        </Link>
                        <Link href="/settings" onClick={() => setIsOpen(false)}>
                            <div className="flex items-center px-3 py-1.5 text-sm rounded-md hover:bg-secondary/50 cursor-pointer transition-colors">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </div>
                        </Link>
                    </div>
                    <div className="p-1 border-t border-border/50">
                        <div
                            className="flex items-center px-3 py-1.5 text-sm rounded-md hover:bg-destructive/10 text-destructive cursor-pointer transition-colors"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}

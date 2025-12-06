"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [notifications, setNotifications] = useState(true);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        toast.success("Settings updated successfully");
    };

    return (
        <div className="container max-w-2xl mx-auto p-4 md:py-8">
            <div className="mb-6">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </div>

            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Security</CardTitle>
                        <CardDescription>
                            Manage your password and account access.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSave}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input id="confirm-password" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Update Password"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>
                            Configure how you receive alerts and updates.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Push Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive alerts for price movements.
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={notifications}
                                    onCheckedChange={setNotifications}
                                />
                                <span className="text-sm text-muted-foreground">{notifications ? 'On' : 'Off'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

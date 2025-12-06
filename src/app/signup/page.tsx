"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validatePassword = (password: string) => {
        if (password.length < 8 || password.length > 20) return "Password must be 8-20 characters long."; // Adjusted slightly for UX
        if (!/[0-9]/.test(password)) return "Password must contain a number.";
        if (!/[!@#$%^&*]/.test(password)) return "Password must contain a symbol.";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            toast.error(passwordError);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);

        // ... inside component

        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // Set display name (default to email prefix)
            await updateProfile(user, {
                displayName: formData.email.split("@")[0]
            });

            // Create user document in Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                createdAt: new Date().toISOString(),
                bio: "",
                image: ""
            });

            toast.success("Account created successfully", {
                description: "Redirecting to onboarding..."
            });

            router.push("/login?onboarding=true"); // Or simpler: router.push("/") since auto-login happens

        } catch (error: any) {
            console.error(error);
            let message = "Registration failed";
            if (error.code === 'auth/email-already-in-use') message = "Email already in use";
            if (error.code === 'auth/weak-password') message = "Password is too weak";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Create an Account</CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>


                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Must be 8-20 chars, include a number and a symbol.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 mt-6">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign Up
                        </Button>
                        <div className="text-sm text-center text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:underline">
                                Login
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Camera } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/canvasUtils";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export default function ProfilePage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarUrl, setAvatarUrl] = useState("");

    // Cropping State
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isCropOpen, setIsCropOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        bio: "",
        dob: "",
        gender: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        name: data.name || user.displayName || "",
                        email: data.email || user.email || "",
                        bio: data.bio || "",
                        dob: data.dob || "",
                        gender: data.gender || ""
                    });
                    setAvatarUrl(data.image || user.photoURL || "");
                } else {
                    // Fallback to Auth data if no firestore doc (shouldn't happen with new signup)
                    setFormData(prev => ({
                        ...prev,
                        name: user.displayName || "",
                        email: user.email || ""
                    }));
                    setAvatarUrl(user.photoURL || "");
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        fetchProfile();
    }, [user]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImageSrc(reader.result?.toString() || "");
                setIsCropOpen(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCropSave = async () => {
        if (!user) return;
        try {
            if (imageSrc && croppedAreaPixels) {
                const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
                if (croppedImage) {
                    setAvatarUrl(croppedImage); // Optimistic update

                    // Save to DB (Firestore)
                    // Note: Storing Base64 in Firestore is not recommended for production (size limits).
                    // Ideally use Firebase Storage. For this task scope, we store in Firestore.
                    const docRef = doc(db, "users", user.uid);
                    await updateDoc(docRef, { image: croppedImage });

                    // Also try to update Auth profile if possible (though auth profile URL usually needs public HTTPS link)
                    // await updateProfile(user, { photoURL: croppedImage });

                    setIsCropOpen(false);
                    toast.success("Profile picture updated!");
                }
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to crop image");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsLoading(true);
        try {
            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef, {
                name: formData.name,
                dob: formData.dob,
                bio: formData.bio
                // email cannot be updated easily here
            });

            // Sync display name to Auth
            if (formData.name !== user.displayName) {
                await updateProfile(user, { displayName: formData.name });
            }

            toast.success("Profile updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container max-w-2xl mx-auto p-4 md:py-8">
            <div className="mb-8">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </div>

            <Card className="relative overflow-visible mt-12">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="ring-4 ring-background rounded-full">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={avatarUrl} alt="Profile" />
                                <AvatarFallback className="text-2xl">{formData.name ? formData.name.charAt(0) : "U"}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="h-8 w-8 text-white" />
                        </div>
                    </div>
                </div>

                <CardHeader className="pt-16 text-center">
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>
                        Update your personal information and public profile.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSave}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Display Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                disabled // Make email read-only
                                className="bg-muted text-muted-foreground cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input
                                id="dob"
                                name="dob"
                                type="date"
                                value={formData.dob}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Input
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end mt-4">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <Dialog open={isCropOpen} onOpenChange={setIsCropOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Crop Profile Picture</DialogTitle>
                    </DialogHeader>
                    <div className="relative w-full h-[300px] bg-black/5 rounded-md overflow-hidden">
                        {imageSrc && (
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        )}
                    </div>
                    <div className="py-4">
                        <Label className="mb-2 block">Zoom</Label>
                        <Slider
                            value={[zoom]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(val: number[]) => setZoom(val[0])}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCropOpen(false)}>Cancel</Button>
                        <Button onClick={handleCropSave}>Save Picture</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

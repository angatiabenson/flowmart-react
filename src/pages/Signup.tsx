import React, { useState } from 'react';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '../ui/primitives';
import { Package } from 'lucide-react';

interface SignUpPageProps {
    onSignUp: () => void;
    onNavigateToLogin: () => void;
}

export const SignUpPage = ({ onSignUp, onNavigateToLogin }: SignUpPageProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onSignUp();
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-md space-y-4">
                 <div className="flex flex-col items-center justify-center space-y-2 mb-8">
                    <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary shadow-sm">
                        <Package className="h-5 w-5" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
                        <p className="text-sm text-muted-foreground">Get started with FlowMart Inventory today</p>
                    </div>
                </div>

                <Card className="border-muted-foreground/10 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-lg">Sign Up</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First name</Label>
                                    <Input id="firstName" required placeholder="Jane" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last name</Label>
                                    <Input id="lastName" required placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="name@example.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input id="confirmPassword" type="password" required />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Creating account..." : "Create Account"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button 
                        onClick={onNavigateToLogin}
                        className="font-medium text-primary hover:underline underline-offset-4"
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
};

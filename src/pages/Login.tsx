import React, { useState } from 'react';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '../ui/primitives';
import { Package } from 'lucide-react';
import { useApi } from '@/hooks/useApi';

interface LoginPageProps {
    onLogin: () => void;
    onNavigateToSignUp: () => void;
}

export const LoginPage = ({ onLogin, onNavigateToSignUp }: LoginPageProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const api = useApi();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await api.login(email, password);

            if (response.status === 'error') {
                setError(response.message);
                setIsLoading(false); // Stop loading on error
                return;
            }

            // Success case
            setTimeout(() => {
                onLogin();
            }, 800);
        } catch (err) {
            // Should not be reached for standard API errors anymore
            console.error("Unexpected error:", err);
            setError("An unexpected error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-md space-y-4">
                <div className="flex flex-col items-center justify-center space-y-2 mb-8">
                    <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
                        <Package className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">Enter your credentials to access your inventory</p>
                    </div>
                </div>

                <Card className="border-muted-foreground/10 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-lg">Sign In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
                                {error}
                            </div>
                        )}
                        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <button type="button" className="text-xs text-primary hover:underline">
                                        Forgot password?
                                    </button>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <button
                        onClick={onNavigateToSignUp}
                        className="font-medium text-primary hover:underline underline-offset-4"
                    >
                        Create an account
                    </button>
                </div>
            </div>
        </div>
    );
};
import React, { useState } from 'react';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, ErrorBanner } from '../ui/primitives';
import { Package } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/context/AuthContext';

interface SignUpPageProps {
    onSignUp: () => void;
    onNavigateToLogin: () => void;
}

interface SignUpFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

export const SignUpPage = ({ onSignUp, onNavigateToLogin }: SignUpPageProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<SignUpFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    //hooks
    const api = useApi();
    const authContext = useAuth();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            setErrorMessage(null);

        // Basic validation
        if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        if (!/^\d{7,15}$/.test(formData.phone)) {
            setErrorMessage("Please enter a valid phone number.");
            return;
        }

        if (formData.password.length < 6) {
            setErrorMessage("Password must be at least 6 characters long.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        const response = await api.signup({
            name: formData.firstName + ' ' + formData.lastName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
        });

        if (response.status === 'error') {
            setErrorMessage(response.message);
            return;
        }

        authContext.login({
            token: response.data.api_key,
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
        });

        onSignUp();
        } catch (error) {
            setErrorMessage("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
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
                                    <Input id="firstName" required placeholder="Jane" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last name</Label>
                                    <Input id="lastName" required placeholder="Doe" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="name@example.com" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" type="tel" placeholder="07xxxx" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" placeholder="........" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input id="confirmPassword" type="password" placeholder="........" required value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Creating account..." : "Create Account"}
                            </Button>
                            {errorMessage && (
                                <ErrorBanner message={errorMessage} />
                            )}
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

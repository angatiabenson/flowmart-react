import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Input, Label, Button } from '../ui/primitives';
import { AlertDialog } from '../ui/alert-dialog';

export const SettingsView = () => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    // Mock user state
    const [user, setUser] = useState({
        name: 'Admin User',
        email: 'admin@flowmart.com',
        role: 'Administrator'
    });

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would make an API call
        alert("Profile saved successfully!");
    };

    const handleDeleteAccount = () => {
        // In a real app, this would delete the account
        alert("Account deleted. Redirecting to login...");
        window.location.reload();
    };

    return (
        <div className="max-w-4xl space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input 
                                    id="fullName" 
                                    value={user.name} 
                                    onChange={(e) => setUser({...user, name: e.target.value})} 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <Input 
                                    id="role" 
                                    value={user.role} 
                                    disabled 
                                    className="bg-muted text-muted-foreground"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                value={user.email} 
                                onChange={(e) => setUser({...user, email: e.target.value})} 
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                        <div className="space-y-1">
                            <h4 className="font-medium text-destructive">Delete Account</h4>
                            <p className="text-sm text-muted-foreground">
                                Permanently remove your account and all associated data. This action cannot be undone.
                            </p>
                        </div>
                        <Button 
                            variant="destructive" 
                            onClick={() => setIsDeleteDialogOpen(true)}
                        >
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog 
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Delete Account?"
                description="This action is irreversible. All your data, products, and categories will be permanently deleted."
                confirmLabel="Yes, Delete My Account"
                onConfirm={handleDeleteAccount}
            />
        </div>
    );
};

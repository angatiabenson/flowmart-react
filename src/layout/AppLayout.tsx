import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, FolderTree, Settings, Menu, User, LogOut, Moon, Sun } from 'lucide-react';
import { cn } from '../ui/primitives';
import type { ViewState } from '../types/types';
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AppLayoutProps {
    children: React.ReactNode;
    currentView: ViewState;
}

const SidebarItem = ({
    icon: Icon,
    label,
    active,
    onClick
}: {
    icon: React.ElementType,
    label: string,
    active: boolean,
    onClick: () => void
}) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
        >
            <Icon className="h-4 w-4" />
            {label}
        </button>
    );
};

function onLogout() {
    const logout = useAuth().logout;
    logout();
}

export const AppLayout = ({ children, currentView }: AppLayoutProps) => {
    const [isDark, setIsDark] = useState(false);

    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <div className="min-h-screen bg-muted/40 flex">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-background md:flex">
                <div className="flex h-14 items-center border-b px-6">
                    <div className="flex items-center gap-2 font-semibold text-lg text-primary">
                        <div className="h-6 w-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
                            <Package className="h-4 w-4" />
                        </div>
                        FlowMart
                    </div>
                </div>
                <div className="flex-1 overflow-auto py-4 px-4">
                    <nav className="grid items-start gap-1">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3 mt-2">
                            Overview
                        </div>
                        <SidebarItem
                            icon={LayoutDashboard}
                            label="Dashboard"
                            active={currentView === 'dashboard'}
                            onClick={() => navigate('/dashboard')}
                        />
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3 mt-6">
                            Inventory
                        </div>
                        <SidebarItem
                            icon={Package}
                            label="All Products"
                            active={currentView === 'products'}
                            onClick={() => navigate('/products')}
                        />
                        <SidebarItem
                            icon={FolderTree}
                            label="Categories"
                            active={currentView === 'categories'}
                            onClick={() => navigate('/categories')}
                        />
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3 mt-6">
                            System
                        </div>
                        <SidebarItem
                            icon={Settings}
                            label="Settings"
                            active={currentView === 'settings'}
                            onClick={() => navigate('/settings')}
                        />
                    </nav>
                </div>

                {/* User Profile Card */}
                <div className="border-t p-4">
                    <DropdownMenu
                        side="top"
                        align="start"
                        trigger={
                            <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted cursor-pointer">
                                <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                                    {user?.name
                                        ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                                        : 'A'}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="truncate text-sm font-medium">{user?.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                                </div>
                            </div>
                        }
                    >
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/settings')}>
                            <User className="mr-2 h-4 w-4" />
                            Profile Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={toggleTheme}>
                            {isDark ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                            Toggle Theme
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={onLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenu>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
                    <button className="md:hidden">
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="w-full flex justify-between items-center">
                        <h1 className="text-lg font-semibold">
                            {currentView === 'dashboard' && 'Dashboard'}
                            {currentView === 'products' && 'Product Catalog'}
                            {currentView === 'categories' && 'Category Management'}
                            {currentView === 'settings' && 'Settings'}
                        </h1>
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    );
};

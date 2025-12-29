import React from 'react';
import { LayoutDashboard, Package, FolderTree, Settings, Menu, User, LogOut, Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ViewState } from '../types/types';
import { Button } from '@/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';

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
        <Button
            variant={active ? "secondary" : "ghost"}
            className={cn("w-full justify-start gap-3", active && "bg-accent text-accent-foreground")}
            onClick={onClick}
        >
            <Icon className="h-4 w-4" />
            {label}
        </Button>
    );
};

export const AppLayout = ({ children, currentView }: AppLayoutProps) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { setTheme } = useTheme();

    const onLogout = () => {
        logout();
    };

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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start px-2 hover:bg-muted">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="" alt={user?.name} />
                                        <AvatarFallback>{user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 text-left overflow-hidden">
                                        <p className="truncate text-sm font-medium">{user?.name}</p>
                                        <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                                    </div>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/settings')}>
                                <User className="mr-2 h-4 w-4" />
                                Profile Settings
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <Sun className="mr-2 h-4 w-4 dark:hidden" />
                                    <Moon className="mr-2 h-4 w-4 hidden dark:block" />
                                    <span>Theme</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem onClick={() => setTheme("light")}>
                                            <Sun className="mr-2 h-4 w-4" />
                                            <span>Light</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                                            <Moon className="mr-2 h-4 w-4" />
                                            <span>Dark</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTheme("system")}>
                                            <Monitor className="mr-2 h-4 w-4" />
                                            <span>System</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:bg-destructive/10" onClick={onLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur px-6 supports-[backdrop-filter]:bg-background/60">
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                    </Button>
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

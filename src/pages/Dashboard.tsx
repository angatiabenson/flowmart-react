import { AppLayout } from "@/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/primitives';
import { BarChart, DollarSign, AlertTriangle, Package } from 'lucide-react';
import type { Product } from '../types/types';


const DashboardView = ({ products }: { products: Product[] }) => {
    const totalValue = products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
    const lowStock = products.filter(p => p.quantity < 10).length;

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue Potential</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{products.length}</div>
                    <p className="text-xs text-muted-foreground">+2 new since yesterday</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">{lowStock}</div>
                    <p className="text-xs text-muted-foreground">Items below threshold</p>
                </CardContent>
            </Card>
            <Card className="col-span-1 md:col-span-2 lg:col-span-1 bg-primary text-primary-foreground">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white/80">Active Categories</CardTitle>
                    <BarChart className="h-4 w-4 text-white/80" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">4</div>
                    <p className="text-xs text-white/70">All systems operational</p>
                </CardContent>
            </Card>
        </div>
    )
}

export function DashboardPage() {
    return <AppLayout currentView="dashboard">
        <DashboardView products={[]} />
    </AppLayout>;
}


import { AppLayout } from "@/layout/AppLayout";
import { Button, Card, CardContent, CardHeader, CardTitle } from '../ui/primitives';
import { BarChart, DollarSign, AlertTriangle, Package, AlertCircle, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import type { Category, Product } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardView = ({ 
    products, 
    categories, 
    isLoading, 
    error,
    onRetry // Good UX: give them a way to fix it
}: { 
    products: Product[], 
    categories: Category[], 
    isLoading: boolean, 
    error: string | null,
    onRetry?: () => void 
}) => {
    
    // 1. LOADING STATE (Skeletons)
    // We show skeletons that match the exact shape of our cards
    if (isLoading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    // 2. ERROR STATE
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl bg-destructive/5 border-destructive/20">
                <AlertCircle className="h-10 w-10 text-destructive mb-3" />
                <h3 className="text-lg font-semibold text-destructive">Failed to load dashboard</h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                {onRetry && (
                    <Button onClick={onRetry} variant="outline" size="sm" className="gap-2">
                        <RefreshCcw className="h-4 w-4" /> Try Again
                    </Button>
                )}
            </div>
        );
    }

    const lowStock = products.filter(p => p.quantity < 10).length;

    // 3. SUCCESS STATE
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Total Products */}
            <Card className="transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{products.length}</div>
                    <p className="text-xs text-muted-foreground">
                        {products.length === 0 ? "No products in inventory" : "In stock across all categories"}
                    </p>
                </CardContent>
            </Card>

            {/* Low Stock - Uses conditional colors to draw attention */}
            <Card className={`transition-all hover:shadow-md ${lowStock > 0 ? 'border-destructive/50 bg-destructive/5' : ''}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock Products</CardTitle>
                    <AlertTriangle className={`h-4 w-4 ${lowStock > 0 ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${lowStock > 0 ? 'text-destructive' : ''}`}>{lowStock}</div>
                    <p className="text-xs text-muted-foreground">Items below threshold (10)</p>
                </CardContent>
            </Card>

            {/* Active Categories */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-1 bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white/80">Active Categories</CardTitle>
                    <BarChart className="h-4 w-4 text-white/80" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{categories.length}</div>
                    <p className="text-xs text-white/70">Categories currently in use.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export function DashboardPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const api = useApi();

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setIsLoading(true);
            setError(null);

            // This starts both requests at the same time
            const [productResponse, categoryResponse] = await Promise.all([
                api.fetchProducts(),
                api.fetchCategories()
            ]);

            // Check for errors in product response
            if (productResponse.status === 'error') {
                setError(productResponse.message);
                return;
            }

            // Check for errors in category response
            if (categoryResponse.status === 'error') {
                setError(categoryResponse.message);
                return;
            }

            // Both successful: Update state
            setProducts(productResponse.data.products);
            setCategories(categoryResponse.data.categories); // Assuming you have this state

        } catch (err) {
            console.error(err);
            setError('Failed to connect to the server.');
        } finally {
            setIsLoading(false);
        }
    }

    return <AppLayout currentView="dashboard">
        <DashboardView products={products} categories={categories} isLoading={isLoading} error={error} onRetry={loadData}/>
    </AppLayout>;
}


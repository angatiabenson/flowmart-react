import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category, Product } from '@/types/api';
import { ProductFormDialog } from '@/features/ProductFormDialog';
import { useApi } from '@/hooks/useApi';
import { AppLayout } from '@/layout/AppLayout';

interface ProductData {
    name: string;
    quantity: number;
    categoryId: string;
}

interface ProductCatalogProps {
    products: Product[];
    categories: Category[];
    isPageLoading: boolean;
    loadError: string | null;
    onAddProduct: (product: ProductData) => Promise<void>;
    onEditProduct: (id: number, product: ProductData) => Promise<void>;
    onDeleteProduct: (id: number) => Promise<void>;
}

export const ProductCatalog = ({
    products, categories, isPageLoading, loadError,
    onAddProduct, onEditProduct, onDeleteProduct
}: ProductCatalogProps) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filtering Logic - Fixed category ID comparison
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category.id.toString() === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.id.toString().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleDialogSave = async (data: ProductData) => {
        setIsSubmitting(true);
        try {
            if (editingProduct) {
                await onEditProduct(editingProduct.id, data);
            } else {
                await onAddProduct(data);
            }
            setIsDialogOpen(false);
            setEditingProduct(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg bg-destructive/5 border-destructive/20">
                <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                <p className="text-destructive font-medium">{loadError}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
                <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>

            <Card className="overflow-hidden">
                <div className="p-4 bg-muted/30 border-b flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            className="pl-9 bg-background"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full sm:w-48 bg-background">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isPageLoading ? (
                            // Loading Skeletons
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 6 }).map((_, j) => (
                                        <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                    No products found matching your filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((product) => (
                                <TableRow key={product.id} className="group">
                                    <TableCell className="font-mono text-xs text-muted-foreground">#{product.id}</TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-normal capitalize">
                                            {product.category.name}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">{product.quantity}</TableCell>
                                    <TableCell className="text-right">
                                        {product.quantity < 10 ? (
                                            <Badge variant="destructive" className="text-[10px] uppercase">Low Stock</Badge>
                                        ) : (
                                            <Badge variant="secondary" className="text-[10px] uppercase bg-emerald-500/10 text-emerald-600 border-emerald-200">In Stock</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingProduct(product); setIsDialogOpen(true); }}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(product.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            <ProductFormDialog
                open={isDialogOpen}
                onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingProduct(null); }}
                categories={categories}
                onSave={(data) => handleDialogSave(
                    {
                        name: data.name,
                        quantity: data.quantity,
                        categoryId: data.categoryId,
                    }
                )}
                initialData={editingProduct}
                isLoading={isSubmitting}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently remove the item from inventory.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => deleteId && onDeleteProduct(deleteId)}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const api = useApi();

    const loadData = async () => {
        try {
            setIsPageLoading(true);
            const [pRes, cRes] = await Promise.all([api.fetchProducts(), api.fetchCategories()]);

            if (pRes.status === 'error') {
                setLoadError(pRes.message);
                return;
            }
            if (cRes.status === 'error') {
                setLoadError(cRes.message);
                return;
            }

            setProducts(pRes.data.products);
            setCategories(cRes.data.categories);
        } catch (err) {
            setLoadError('Connection failed.');
        } finally {
            setIsPageLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    // --- Action Handlers ---
    const handleAdd = async (data: ProductData) => {
        const res = await api.createProduct({
            name: data.name,
            quantity: data.quantity,
            category_id: data.categoryId,
        });
        if (res.status === 'success') loadData(); // Refresh list
    };

    const handleEdit = async (id: number, data: ProductData) => {
        const res = await api.updateProduct(id, {
            name: data.name,
            quantity: data.quantity,
            category_id: data.categoryId,
        });
        if (res.status === 'success') loadData();
    };

    const handleDelete = async (id: number) => {
        const res = await api.deleteProduct(id);
        if (res.status === 'success') {
            // Optimistic update: remove from state immediately
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };

    return (
        <AppLayout currentView="products">
            <ProductCatalog
                products={products}
                categories={categories}
                isPageLoading={isPageLoading}
                loadError={loadError}
                onAddProduct={handleAdd}
                onEditProduct={handleEdit}
                onDeleteProduct={handleDelete}
            />
        </AppLayout>
    );
}

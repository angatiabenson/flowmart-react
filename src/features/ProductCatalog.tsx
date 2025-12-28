import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { Button, Input, Badge, Select, Card, CardContent } from '../ui/primitives';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Product, Category } from '../../types';
import { ProductFormDialog } from './ProductFormDialog';
import { AlertDialog } from '../ui/alert-dialog';

interface ProductCatalogProps {
    products: Product[];
    categories: Category[];
    onAddProduct: (product: Omit<Product, 'id' | 'lastUpdated'>) => void;
    onEditProduct: (id: string, product: Omit<Product, 'id' | 'lastUpdated'>) => void;
    onDeleteProduct: (id: string) => void;
}

export const ProductCatalog = ({ products, categories, onAddProduct, onEditProduct, onDeleteProduct }: ProductCatalogProps) => {
    const [viewMode, setViewMode] = useState<'all' | 'category'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    
    // Delete Confirmation State
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Filtering Logic
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              product.sku.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown';

    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        setIsAddDialogOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (deleteId) {
            onDeleteProduct(deleteId);
            setDeleteId(null);
        }
    };

    const handleDialogSave = (data: any) => {
        if (editingProduct) {
            onEditProduct(editingProduct.id, data);
        } else {
            onAddProduct(data);
        }
    };

    const handleDialogClose = (open: boolean) => {
        setIsAddDialogOpen(open);
        if (!open) setEditingProduct(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                    <button 
                        onClick={() => { setViewMode('all'); setSelectedCategory('all'); }}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'all' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        All Products
                    </button>
                    <button 
                         onClick={() => { setViewMode('category'); if(selectedCategory === 'all' && categories.length > 0) setSelectedCategory(categories[0].id); }}
                         className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${viewMode === 'category' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        By Category
                    </button>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by name or SKU..." 
                                className="pl-9" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select 
                                value={selectedCategory} 
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full sm:w-48"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">SKU</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                        No products found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                                        <TableCell className="font-medium">
                                            <div>{product.name}</div>
                                            <div className="text-xs text-muted-foreground hidden sm:block truncate max-w-[200px]">{product.description}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal text-secondary-foreground/80">
                                                {getCategoryName(product.categoryId)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-mono">${product.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right font-mono">{product.quantity}</TableCell>
                                        <TableCell className="text-right">
                                            {product.quantity < 10 ? (
                                                <span className="text-xs font-bold text-destructive">Low Stock</span>
                                            ) : (
                                                <span className="text-xs font-bold text-secondary">In Stock</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(product)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteClick(product.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <ProductFormDialog 
                open={isAddDialogOpen} 
                onOpenChange={handleDialogClose}
                categories={categories}
                onSave={handleDialogSave}
                initialData={editingProduct}
            />

            <AlertDialog 
                open={!!deleteId} 
                onOpenChange={(open) => !open && setDeleteId(null)}
                title="Delete Product?"
                description="This action cannot be undone. This will permanently delete the product from the inventory."
                onConfirm={confirmDelete}
            />
        </div>
    );
};

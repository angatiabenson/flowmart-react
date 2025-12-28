import React, { useState } from 'react';
import { Plus, Folder, Trash2, Edit2, ChevronRight } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Label } from '../ui/primitives';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Category, Product } from '../../types';
import { CategoryFormDialog } from './CategoryFormDialog';
import { AlertDialog } from '../ui/alert-dialog';

interface CategoryManagerProps {
    categories: Category[];
    products: Product[];
    onAddCategory: (category: { name: string; description: string }) => void;
    onEditCategory: (id: string, category: { name: string; description: string }) => void;
    onDeleteCategory: (id: string) => void;
}

export const CategoryManager = ({ categories, products, onAddCategory, onEditCategory, onDeleteCategory }: CategoryManagerProps) => {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(categories[0]?.id || null);
    
    // Dialog States
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [newCategory, setNewCategory] = useState({ name: '', description: '' });

    const selectedCategory = categories.find(c => c.id === selectedCategoryId);
    const categoryProducts = products.filter(p => p.categoryId === selectedCategoryId);

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddCategory(newCategory);
        setNewCategory({ name: '', description: '' });
        setIsAddDialogOpen(false);
    };

    const handleEditSave = (data: { name: string; description: string }) => {
        if (selectedCategoryId) {
            onEditCategory(selectedCategoryId, data);
        }
    };

    const handleDeleteConfirm = () => {
        if (selectedCategoryId) {
            onDeleteCategory(selectedCategoryId);
            setSelectedCategoryId(null); // Clear selection or select another
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
            {/* Sidebar List */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
                <Card className="flex-1 flex flex-col min-h-0">
                    <CardHeader className="flex flex-row items-center justify-between py-4">
                        <CardTitle className="text-lg">Categories</CardTitle>
                        <Button size="sm" onClick={() => setIsAddDialogOpen(true)} variant="outline">
                            <Plus className="h-4 w-4 mr-1" /> New
                        </Button>
                    </CardHeader>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {categories.map(category => (
                            <div 
                                key={category.id}
                                onClick={() => setSelectedCategoryId(category.id)}
                                className={`
                                    group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors border
                                    ${selectedCategoryId === category.id 
                                        ? 'bg-primary/5 border-primary/20' 
                                        : 'bg-background border-transparent hover:bg-muted'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-md ${selectedCategoryId === category.id ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                        <Folder className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-medium ${selectedCategoryId === category.id ? 'text-primary' : 'text-foreground'}`}>
                                            {category.name}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">{category.productCount} items</p>
                                    </div>
                                </div>
                                {selectedCategoryId === category.id && (
                                     <ChevronRight className="h-4 w-4 text-primary" />
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Detail View */}
            <div className="w-full lg:w-2/3 flex flex-col">
                {selectedCategory ? (
                    <Card className="flex-1 flex flex-col min-h-0 border-0 shadow-none bg-transparent lg:border lg:bg-card lg:shadow-sm">
                        <CardHeader className="border-b bg-card pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedCategory.name}</h2>
                                    <p className="text-muted-foreground">{selectedCategory.description}</p>
                                </div>
                                <div className="flex gap-2">
                                     <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                                        <Edit2 className="h-4 w-4 mr-2" /> Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => setIsDeleteDialogOpen(true)}>
                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-hidden flex flex-col bg-card">
                            <div className="flex-1 overflow-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product Name</TableHead>
                                            <TableHead>SKU</TableHead>
                                            <TableHead className="text-right">Stock</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {categoryProducts.length === 0 ? (
                                             <TableRow>
                                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                    No products in this category.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            categoryProducts.map(product => (
                                                <TableRow key={product.id}>
                                                    <TableCell className="font-medium">{product.name}</TableCell>
                                                    <TableCell className="font-mono text-xs text-muted-foreground">{product.sku}</TableCell>
                                                    <TableCell className="text-right">
                                                         {product.quantity < 10 ? (
                                                            <span className="text-xs font-bold text-destructive">{product.quantity} (Low)</span>
                                                        ) : (
                                                            <span className="text-xs">{product.quantity}</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono">${product.price.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        Select a category to view details
                    </div>
                )}
            </div>

            {/* Add Category Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Category</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddSubmit} className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="cat-name">Name</Label>
                            <Input 
                                id="cat-name" 
                                value={newCategory.name} 
                                onChange={e => setNewCategory({...newCategory, name: e.target.value})}
                                placeholder="e.g. Office Supplies"
                                required 
                            />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="cat-desc">Description</Label>
                            <Input 
                                id="cat-desc" 
                                value={newCategory.description} 
                                onChange={e => setNewCategory({...newCategory, description: e.target.value})}
                                placeholder="Short description..."
                                required 
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Create Category</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Category Dialog */}
            <CategoryFormDialog 
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                initialData={selectedCategory}
                onSave={handleEditSave}
            />

            {/* Delete Confirmation */}
            <AlertDialog 
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Delete Category?"
                description={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

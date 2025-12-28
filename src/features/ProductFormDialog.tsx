import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button, Input, Label, Select } from '../ui/primitives';
import { Product, Category } from '../../types';

interface ProductFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Product | null;
    categories: Category[];
    onSave: (product: Omit<Product, 'id' | 'lastUpdated'>) => void;
}

export const ProductFormDialog = ({ open, onOpenChange, initialData, categories, onSave }: ProductFormDialogProps) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        sku: '',
        categoryId: ''
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                setFormData({
                    name: initialData.name,
                    description: initialData.description,
                    price: initialData.price.toString(),
                    quantity: initialData.quantity.toString(),
                    sku: initialData.sku,
                    categoryId: initialData.categoryId
                });
            } else {
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    quantity: '',
                    sku: '',
                    categoryId: categories[0]?.id || ''
                });
            }
        }
    }, [open, initialData, categories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price) || 0,
            quantity: parseInt(formData.quantity) || 0,
            sku: formData.sku,
            categoryId: formData.categoryId
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]" onClose={() => onOpenChange(false)}>
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input 
                                id="name" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                placeholder="e.g. Ergonomic Chair" 
                                required 
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sku">SKU</Label>
                            <Input 
                                id="sku" 
                                name="sku" 
                                value={formData.sku} 
                                onChange={handleChange} 
                                placeholder="PROD-001" 
                                className="font-mono"
                                required 
                            />
                        </div>
                    </div>
                    
                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select 
                            id="category" 
                            name="categoryId" 
                            value={formData.categoryId} 
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Select a category...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input 
                            id="description" 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            placeholder="Brief product description" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input 
                                id="price" 
                                name="price" 
                                type="number" 
                                step="0.01" 
                                value={formData.price} 
                                onChange={handleChange} 
                                placeholder="0.00" 
                                required 
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input 
                                id="quantity" 
                                name="quantity" 
                                type="number" 
                                value={formData.quantity} 
                                onChange={handleChange} 
                                placeholder="0" 
                                required 
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Save Product
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

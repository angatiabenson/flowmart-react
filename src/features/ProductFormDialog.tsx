import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button, Input, Label, Select } from '../ui/primitives';
import type { Category, Product } from '@/types/api';

interface ProductFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Product | null;
    categories: Category[];
    isLoading: boolean;
    onSave: (product: Omit<{
        name: string;
        quantity: number;
        categoryId: string;
    }, 'id' | 'lastUpdated'>) => void;
}

export const ProductFormDialog = ({ open, onOpenChange, initialData, categories, onSave, isLoading}: ProductFormDialogProps) => {
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        categoryId: '',
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                setFormData({
                    name: initialData.name,
                    quantity: initialData.quantity.toString(),
                    categoryId: initialData.category.id.toString()
                });
            } else {
                setFormData({
                    name: '',
                    quantity: '',
                    categoryId: categories[0]?.id.toString() || ''
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
            quantity: parseInt(formData.quantity) || 0,
            categoryId: formData.categoryId.toString(),
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
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Product Name"
                            required
                            className="w-full"
                        />
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
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                            id="quantity"
                            name="quantity"
                            type="number"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="Product Quantity"
                            required
                            className="w-full"
                        />
                    </div>

                    <DialogFooter className="mt-4">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating Product...' : 'Create Product'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button, Input, Label } from '../ui/primitives';
import { Category } from '../../types';

interface CategoryFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Category;
    onSave: (data: { name: string; description: string }) => void;
}

export const CategoryFormDialog = ({ open, onOpenChange, initialData, onSave }: CategoryFormDialogProps) => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        if (open && initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description
            });
        } else if (open && !initialData) {
            setFormData({ name: '', description: '' });
        }
    }, [open, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Category' : 'Add Category'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="cat-name-edit">Name</Label>
                        <Input 
                            id="cat-name-edit" 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            required 
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="cat-desc-edit">Description</Label>
                        <Input 
                            id="cat-desc-edit" 
                            value={formData.description} 
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            required 
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

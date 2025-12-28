export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    sku: string;
    categoryId: string;
    lastUpdated: string;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    productCount: number;
}

export interface InventoryStats {
    totalProducts: number;
    totalValue: number;
    lowStockItems: number;
}

export type ViewState = 'dashboard' | 'products' | 'categories' | 'settings';

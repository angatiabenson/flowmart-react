export interface InventoryStats {
    totalProducts: number;
    totalValue: number;
    lowStockItems: number;
}

export type ViewState = 'dashboard' | 'products' | 'categories' | 'settings';

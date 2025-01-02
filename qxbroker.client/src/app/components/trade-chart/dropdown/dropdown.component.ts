import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrl: './dropdown.component.scss'
})
export class TradeChartDropdownComponent {
    @Input() tradePairs: any[] = [];
    @Input() selectedTradePairs: any[] = [];
    @Output() onPairSelect = new EventEmitter<any>();
    @Output() onPairFavorite = new EventEmitter<any>();
    @Output() onDropdownClose = new EventEmitter<boolean>();

    public sortColumn: string = 'name';
    public sortDirection: 'asc' | 'desc' = 'asc';
    
    public searchText: string = ''; 
    public showFavoritesOnly: boolean = false;
    public lastFavoriteIndex: number | null = null;
    public tradePairType: TradePairType | null = 'crypto'; 

    public get favoritesCount(): any {
        return this.tradePairs.filter(x => x.isFavorite === true).length;
    }

    public get filteredTradePairs(): any {
        const favorites: any[] = [];
        const regular: any[] = [];

        this.tradePairs.forEach((tradePair) => {
            if (this.showFavoritesOnly) {
                if (tradePair.isFavorite) {
                    favorites.push(tradePair);
                }
            } else {
                if (this.searchText.trim().length <= 0) {
                    if (tradePair.tradePairType === this.tradePairType) {
                        if (tradePair.isFavorite) {
                            favorites.push(tradePair);
                        } else {
                            regular.push(tradePair);
                        }
                    }
                } else {
                    const includesSearchText = tradePair.name.toLowerCase().includes(this.searchText.toLowerCase());
                    if (includesSearchText) {
                        regular.push(tradePair);
                    }
                }
            }
        });

        this.lastFavoriteIndex = regular.length > 0
            ? favorites.length - 1
            : null;
        
        // Sort logic
        if (this.sortColumn) {
            favorites.sort((a, b) => {
                const aValue = a[this.sortColumn];
                const bValue = b[this.sortColumn];
                if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });

            regular.sort((a, b) => {
                const aValue = a[this.sortColumn];
                const bValue = b[this.sortColumn];
                if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return [...favorites, ...regular];
    }

    public setSort(columnName: string) {
        if (this.sortColumn === columnName) {
            this.sortDirection = this.sortDirection === 'asc'
                ? this.sortDirection = 'desc'
                : this.sortDirection = 'asc';

            return;
        }

        this.sortColumn = columnName;
        this.sortDirection = 'asc'; 
    }

    public selectPair(pair: any): void {
        this.onPairSelect.emit(pair);
    }

    public closeDropdown(): void {
        this.onDropdownClose.emit(false);
    }

    public toggleFavorite(pair: any): void {
        pair.isFavorite = !pair.isFavorite;
        this.onPairFavorite.emit(pair);
    }

    public showFavorites(): void {
        if (this.favoritesCount < 0) {
            return;
        }

        if (this.showFavoritesOnly) {
            this.tradePairType = 'currencies';
        } else {
            this.tradePairType = null;
        }

        this.showFavoritesOnly = !this.showFavoritesOnly;
    }
}

export type TradePairType = 'currencies' | 'crypto' | 'commodities' | 'stocks';

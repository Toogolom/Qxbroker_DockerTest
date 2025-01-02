import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BetService } from '../../services/bet.service';
import { BetModel } from '../../models/bet.model';
import { AccountType } from '../../enums/account-type.enum';

@Component({
    selector: 'app-trades',
    templateUrl: './trades.component.html',
    styleUrl: './trades.component.scss',
})
export class TradesComponent {
    public accountTypeDropdownOpened: boolean = false;
    public exportDropdownOpened: boolean = false;

    public filterForm: FormGroup = new FormGroup({
        dateFrom: new FormControl(new Date()),
        dateTo: new FormControl(new Date()),
        accountType: new FormControl('Live'),
    });

    public allTradeItems: BetModel[] = [];
    public tradeItems: BetModel[] = [];

    public currentPage: number = 1;
    public ITEMS_PER_PAGE: number = 50;

    private readonly betService = inject(BetService);

    public ngOnInit(): void {
        this.fetchAllTradeItems();
    }

    public fetchAllTradeItems(): void {
        const { dateFrom, dateTo, accountType } = this.filterForm.value;

        const accountTypeEnum = accountType === 'Demo' ? AccountType.Demo : AccountType.Live;

        this.betService
            .getBetHistoryWithQuery(accountTypeEnum, dateFrom, dateTo)
            .then((bets) => {
                this.allTradeItems = bets;
                this.updatePaginatedItems();
            })
            .catch((error) => {
                console.error('Failed to fetch trade items:', error);
            });
    }

    public updatePaginatedItems(): void {
        const startIndex = (this.currentPage - 1) * this.ITEMS_PER_PAGE;
        const endIndex = startIndex + this.ITEMS_PER_PAGE;
        this.tradeItems = this.allTradeItems.slice(startIndex, endIndex);
    }

    public toggleAccountTypeDropdown(): void {
        this.accountTypeDropdownOpened = !this.accountTypeDropdownOpened;
    }

    public closeAccountTypeDropdown(): void {
        this.accountTypeDropdownOpened = false;
    }

    public selectAccountType(type: string): void {
        this.filterForm.patchValue({ accountType: type });
        this.accountTypeDropdownOpened = false;
    }

    public closeExportDropdown(): void {
        this.exportDropdownOpened = false;
    }

    public toggleExportDropdown(): void {
        this.exportDropdownOpened = !this.exportDropdownOpened;
    }

    public applyFilters(): void {
        this.currentPage = 1;
        this.fetchAllTradeItems();
    }

    public goToPage(page: number): void {
        if (page > 0 && page <= this.totalPages) {
            this.currentPage = page;
            this.updatePaginatedItems();
        }
    }

    public get totalPages(): number {
        return Math.max(1, Math.ceil(this.allTradeItems.length / this.ITEMS_PER_PAGE));
    }

    public nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }

    public prevPage(): void {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }
}

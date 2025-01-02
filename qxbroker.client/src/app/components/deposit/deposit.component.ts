import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { depositVariants, IDepositVariant } from './deposit-info';

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
    styleUrl: './deposit.component.scss'
})
export class DepositComponent implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);

    public showBonusBanner: boolean = false;
    public fromBonusBanner: boolean = false;

    public ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            this.fromBonusBanner = this.showBonusBanner = params['fromBonusBanner'] ?? false;
        });
    }

    public depositVariants: IDepositVariant[] = depositVariants;

    public navigateToDepositType(depositType: string): void {
        if (this.fromBonusBanner) {
            this.router.navigate([`/deposit/${depositType}`], { queryParams: { fromBonusBanner: 'true' }});
            return;
        }

        this.router.navigate([`/deposit/${depositType}`]);
    }

    public closeBonusBanner(): void {
        this.showBonusBanner = false;
    }
}
import { Component, inject } from '@angular/core';
import { ITransactionRequestModel, UserService } from '../../../services/user.service';
import { faq, IFaq } from '../faq';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../../services/config-service';
import { IBonusModel } from '../../../models/bonus.model';
import { depositVariants, IDepositVariant, TransactionType } from '../deposit-info';

@Component({
	selector: 'app-payment',
	templateUrl: './payment.component.html',
	styleUrl: './payment.component.scss'
})
export class PaymentComponent {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly configService = inject(ConfigService);
    private readonly router = inject(Router);
	private readonly userService = inject(UserService);

	public user$ = this.userService.user$;
    
    public fromBonusBanner: boolean = false;
    public firstDepBonus: IBonusModel | null = null;

    public amount: number = 100;
    public showMinDepositErrorAlert: boolean = false;
    
    // public bonuses: IBonus[] = bonuses;
    public bonuses: IBonus[] = [];
    public paymentInfo: IDepositVariant | null = null;

    public selectedBonus: IBonus | null = null;

	public faq: IFaq[] = faq;

    public async ngOnInit(): Promise<void> {
        this.activatedRoute.paramMap.subscribe(params => {
            const paymentCode = params.get('type');
            this.paymentInfo = depositVariants.find(variant => variant.code === paymentCode) ?? null;            
        });

        this.activatedRoute.queryParams.subscribe(async params => {
            // cors fix
            setTimeout(async () => {
                this.fromBonusBanner = params['fromBonusBanner'] ?? false;
                this.firstDepBonus = await this.configService.getFirstDepositBonus();
                
                if (this.firstDepBonus) {   
                    await this.configService.getBonuses()
                        .then((list) => {
                            list = list?.filter(bonus => bonus.code !== "BonusForFirstDep") ?? [];
                            this.bonuses = list.map(bonus =>  this.mapBonusModelToBonus(bonus));
                        });
                } else {
                    await this.configService.getBonuses()
                        .then((list) => {
                            this.bonuses = list?.map(bonus =>  this.mapBonusModelToBonus(bonus)) ?? [];
                        } );
    
                    if (this.fromBonusBanner) {
                        this.selectBonus(this.bonuses.find(bonus => bonus.code === "BonusForFirstDep")!);
                    }
                }
            }, 500);     
        });
    }

    public navigateToDeposit(): void {
        if (this.fromBonusBanner) {
            this.router.navigate([`/deposit`], { queryParams: { fromBonusBanner: 'true' }});
            return;
        }

        this.router.navigate([`/deposit`]);
    }

    public async navigateToConfirm(): Promise<void> {
        if (!this.paymentInfo) {
            return;
        }

        if (this.selectedBonus) {
            this.amount += this.calculateBonus(this.selectedBonus);
        }

        const data: ITransactionRequestModel = {
            paymentSystem: this.paymentInfo.paymentSystem,
            type: TransactionType.Deposit,
            amount: this.amount
        }

        let id: string = '';
        await this.userService.addTransaction(data)
            .then(data =>  id = data.id);
        
        this.router.navigate([`/deposit/confirm/`, id]);
    }

    public setAmount(value: number): void {
		this.amount = value;
	}

    public selectBonus(bonus: IBonus): void {
		this.selectedBonus = bonus;
        this.checkBonusValidity(this.selectedBonus);
	}

    public calculateBonus(bonus: IBonus): number {
        this.checkBonusValidity(this.selectedBonus);
        return this.amount * (bonus.percent / 100);
    }

    private checkBonusValidity(bonus: IBonus | null) {
        if (!bonus) {
            return;
        }

        if (bonus.minAmount && bonus.minAmount > this.amount) {
            this.showMinDepositErrorAlert = true;
        } else {
            this.showMinDepositErrorAlert = false;
        }
    }

    private mapBonusModelToBonus(bonus: IBonusModel): IBonus {
        return {
            code: bonus.code,
            name: bonus.name,
            percent: bonus.percent,
            minAmount: bonus.minAmount,
            classes: bonus.name === "BonusForFirstDep" ? ['gold'] : []
        };
    }
}

export interface IBonus {
    code: string;
    name: string;
    percent: number;
    minAmount: number;
    classes: string[];
}

import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user.service';
import { AppState } from '../../services/app-state.service';
import { AccountType } from '../../enums/account-type.enum';
import { trigger, style, transition, animate } from '@angular/animations';
import { AccountTypeChangedDialogService, DialogData } from '../dialogs/account-type-changed-dialog/account-type-changed-dialog.service';
import { UserModel } from '../../models/user.model';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UpdateDemoBalanceRequest } from '../../models/requests/update-demo-balance-request.model';
import { Router } from '@angular/router';
import { UserStatusDialogService } from '../dialogs/user-status-dialog/user-status-dialog.service';
import { VipStatus } from '../../enums/vip-status.enum';
import { environment } from '../../../environments/environment';
import { ConfigService } from '../../services/config-service';

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrl: './page-header.component.scss',
    animations: [
        trigger('dropdownAnimation', [
            transition(':enter', [
                style({ opacity: 0, top: '100%' }),
                animate('100ms ease-in', style({ opacity: 1, top: 'calc(100% + 8px)' })) 
            ]),
            transition(':leave', [
                animate('100ms ease-out', style({ opacity: 0, top: '100%' }))
            ])
        ])
    ]
})
export class PageHeaderComponent {
    private readonly authService = inject(AuthService);
    private readonly accountTypeChangedDialogService = inject(AccountTypeChangedDialogService);
    private readonly appState = inject(AppState);
    private readonly configService = inject(ConfigService);
    private readonly router = inject(Router);
    private readonly userService = inject(UserService);
    private readonly userStatusDialogService = inject(UserStatusDialogService);

    public user$: Observable<UserModel | null>;
    public userMenuOpened: boolean = false;
    public editBalanceInputOpened: boolean = false;

    public VipStatus = VipStatus;

    public AccountType = AccountType;
    public accountType = this.appState.accountType$.asObservable();
    public currency: string = '';
    public updateDemoBalanceForm: FormGroup = new FormGroup({
        balance: new FormControl<number>(this.userService.userData?.demoBalance ?? 0, [Validators.max(10000)])
    });

    public isTargetRoute: boolean = false;
    public hasTransactions: boolean = true;

    constructor() { 
        this.user$ = this.userService.user$;
        this.currency = this.appState.currency$.getValue();

        this.router.events.subscribe(() => {
            this.isTargetRoute = this.router.url.includes('trade');
        });

        // TODO: Fix CORS and remove it
        setTimeout(() => {
            this.configService.getFirstDepositBonus()
                .then((data) => {
                    if (!data) {
                        this.hasTransactions = false;
                    }
                });
        }, 500);
    }

    public async logout() {
        await this.authService.logout();
    }

    public openUserMenu(): void {
        this.userMenuOpened = true;
    }

    public closeUserMenu(): void {
        setTimeout(() => {
            this.userMenuOpened = false;
        }, 200);
    }

    public openUserStatusDialog(): void {
        this.closeUserMenu();
        this.userStatusDialogService.openDialog();
    }

    public changeAccountType(type: AccountType): void {
        const accountTypeBeforeChange = this.appState.accountType$.getValue();
        if (accountTypeBeforeChange === type) {
            return;
        }
        
        this.appState.accountType$.next(type);
        this.accountTypeChangedDialogService.openDialog(
            new DialogData(
                accountTypeBeforeChange, 
                type, 
                this.getBalance(accountTypeBeforeChange), 
                this.getBalance(type)
            )
        );
    }

    public getBalance(type: AccountType): number {
        switch (type) {
            case AccountType.Demo:
                return this.userService.userData?.demoBalance ?? 0;
            case AccountType.Live:
                return this.userService.userData?.totalBalance ?? 0;
        }
    }

    public async updateDemoBalance(balance: number | null = null): Promise<void> {
        if (this.updateDemoBalanceForm.invalid) {
            return;
        }

        const demoBalance = balance ? balance : this.updateDemoBalanceForm.get('balance')?.value;

        try {
            const request: UpdateDemoBalanceRequest = {
                email: this.userService.userData?.email,
                demoBalance: demoBalance < 10000 
                    ? demoBalance
                    : 10000
            };

            await this.userService.updateDemoBalance(request)
                .then(() => { 
                    this.userService.getUser();
                    this.editBalanceInputOpened = false;
                });
        }
        catch {
            // TODO: handle error
        }
    }

    public navigateTo(route: string): void {
        this.router.navigate([route]);
        this.closeUserMenu();
    }


    public toggleEditBalanceInput(): void {
        this.editBalanceInputOpened = !this.editBalanceInputOpened;
    }

    public formattedUserPhotoURL(url: string): string {
		return environment.apiBaseUrl + url;
    }
}

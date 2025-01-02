import { Component, inject } from '@angular/core';
import { AccountType } from '../../../enums/account-type.enum';
import { AccountTypeChangedDialogService, DialogData } from './account-type-changed-dialog.service';

@Component({
    selector: 'app-account-type-changed-dialog',
    templateUrl: './account-type-changed-dialog.component.html',
    styleUrl: './account-type-changed-dialog.component.scss'
})
export class AccountTypeChangedDialogComponent {
    public dialogService = inject(AccountTypeChangedDialogService);

    public dialogData: DialogData | null = null;
    public AccountType = AccountType;

    constructor() { 
        this.dialogService.accountData$.subscribe(accountData => {
            this.dialogData = accountData;
        });
    }

    public closeDialog(): void {
        this.dialogService.closeDialog();
    }

    public getAccountTypeName(accountType: AccountType | null): string {
        switch (accountType) {
            case AccountType.Demo:
                return 'Demo Account';
            case AccountType.Live:
                return 'Live Account';
            default:
                return '';
        }
    }

    public getIconClass(accountType: AccountType | null): string {
        switch (accountType) {
            case AccountType.Demo:
                return 'icon-demo';
            case AccountType.Live:
                return 'icon-profile-level-standart';
            default:
                return '';
        }
    }
}

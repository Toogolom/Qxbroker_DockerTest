import { Component, inject, ViewEncapsulation } from '@angular/core';
import { faq, IFaq } from './faq';
import { UserVerificationDialogService } from '../dialogs/user-verification-dialog/user-verification-dialog.service';
import { UserService } from '../../services/user.service';
import { TransactionStatus } from '../../models/transaction.model';
import { VerificationStatus } from '../../models/verification.model';
import { VipStatus } from '../../enums/vip-status.enum';
import { UserStatusDialogService } from '../dialogs/user-status-dialog/user-status-dialog.service';

@Component({
    selector: 'app-withdrawal',
    templateUrl: './withdrawal.component.html',
    styleUrl: './withdrawal.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class WithdrawalComponent {
    private readonly userService = inject(UserService);
    private readonly userStatusDialogService = inject(UserStatusDialogService);
    private readonly userVerificationDialogService = inject(UserVerificationDialogService);

    public user$ = this.userService.user$;
    public faq: IFaq[] = faq;
    public amount: number = 10;

    public VerificationStatus = VerificationStatus;
    public VipStatus = VipStatus;

    public showUserVerificationDialog() {
        this.userVerificationDialogService.openDialog();
    }

    public get transactionsLength(): number {
        return this.userService.userData?.transactions
            .filter(transaction => transaction.status === TransactionStatus.Success)
            .length ?? 0;
    }

    public openUserStatusDialog() {
        this.userStatusDialogService.openDialog();
    }

    public setAmount(value: number): void {
        this.amount = value;
    }
}
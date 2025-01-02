import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { TransactionModel, TransactionStatus, TransactionType } from '../../models/transaction.model';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrl: './transactions.component.scss'
})
export class TransactionsComponent {
    private readonly router = inject(Router);
    private readonly userService = inject(UserService);

    public user$ = this.userService.user$;
    public TransactionStatus = TransactionStatus;
    public TransactionType = TransactionType;


    public goToTransaction(transaction: TransactionModel): void {
        if (transaction.status === TransactionStatus.Waiting) {
            this.router.navigate(['/deposit/confirm', transaction.id]);
        }
    }
}

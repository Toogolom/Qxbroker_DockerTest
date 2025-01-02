import { Component, inject } from '@angular/core';
import { TransactionResultDialogService } from './transaction-result-dialog.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-transaction-result-dialog',
	templateUrl: './transaction-result-dialog.component.html',
	styleUrl: './transaction-result-dialog.component.scss'
})
export class TransactionResultDialogComponent {
	public readonly dialogService = inject(TransactionResultDialogService);
	private readonly router = inject(Router);

	public goToTransactions() {
		this.dialogService.closeDialog();
		this.router.navigate(['/transactions']);
	}
}

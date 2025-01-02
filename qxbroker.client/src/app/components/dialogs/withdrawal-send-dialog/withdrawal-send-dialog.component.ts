import { Component, inject } from '@angular/core';
import { WithdrawalSendDialogService } from './withdrawal-send-dialog.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-withdrawal-send-dialog',
	templateUrl: './withdrawal-send-dialog.component.html',
	styleUrl: './withdrawal-send-dialog.component.scss'
})
export class WithdrawalSendDialogComponent {
	public readonly dialogService = inject(WithdrawalSendDialogService);
	private readonly router = inject(Router);

	public closeDialog() {
		this.dialogService.closeDialog();
	}

	public goToTransactions(): void {
		this.dialogService.closeDialog();
		this.router.navigate(['/transactions']);
	}
}

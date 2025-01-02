import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { faq } from '../faq';
import { ConfigService, IWallet } from '../../../services/config-service';
import { ConfirmTransactionDialogService } from '../../dialogs/confirm-transaction-dialog/confirm-transaction-dialog.service';
import { UserService } from '../../../services/user.service';
import { TransactionModel, TransactionStatus } from '../../../models/transaction.model';
import { ActivatedRoute, Router } from '@angular/router';
import { depositVariants } from '../deposit-info';

@Component({
	selector: 'app-transaction',
	templateUrl: './transaction.component.html',
	styleUrl: './transaction.component.scss'
})
export class TransactionComponent implements OnInit, OnDestroy {
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly configService = inject(ConfigService);
	private readonly confirmTransactionDialogService = inject(ConfirmTransactionDialogService);
	private readonly router = inject(Router);
	private readonly userService = inject(UserService);

	public faq = faq;
	public wallet: IWallet | null = null;
	public transaction: TransactionModel | null = null;

	public remainingTime: string = '';
	private intervalId!: any;
	private transactionId: string = '';

	public async ngOnInit() {
		this.activatedRoute.params
			.subscribe(async (param) => {
				this.transactionId = param['transactionId'];

				if (this.transactionId) {
					// TODO: Fix CORS and remove setTimeout
					setTimeout(async () => {
						await this.userService.getTransactionById(this.transactionId)
							.then(async (transaction) => {
								if (!transaction) {
									return;
								}

								this.transaction = new TransactionModel(transaction);

								console.log(this.transaction.status);
								console.log(TransactionStatus.Waiting);
								
								if (this.transaction.status != TransactionStatus.Waiting) {
									this.router.navigate(['/deposit']);
									return;
								}
								// console.log(this.transaction);
								this.startTimer();
								const wallet = depositVariants.find((variant) => variant.name == transaction?.paymentSystem);
								// console.log('wallet', wallet);
								if (!wallet) {
									return;
								}

								this.wallet = await this.configService.getWalletAddress(wallet.code);
							});
						console.log(this.transaction);
					}, 500);
					
				}
			});
	}

	public ngOnDestroy(): void {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
	}

	public showConfirmTransactionDialog(): void {
		this.confirmTransactionDialogService.openDialog(this.transactionId);
	}

	public copy(data?: string): void {
		if (!data) {
			return;
		}

		navigator.clipboard.writeText(data);
	}


	public navigateToDeposit(): void {
	// 	if (this.fromBonusBanner) {
	// 		this.router.navigate([`/deposit`], { queryParams: { fromBonusBanner: 'true' }});
	// 		return;
	// 	}

	// 	this.router.navigate([`/deposit`]);
	}
	
	private startTimer(): void {
		if (!this.transaction || !this.transaction.dateAndTime) {
			return;
		}

		const transactionTime = new Date(this.transaction.dateAndTime).getTime();
		const expirationTime = transactionTime + 24 * 60 * 60 * 1000; // Добавляем 24 часа
	
		this.intervalId = setInterval(() => {
			const now = Date.now();
			const timeLeft = expirationTime - now;
		
			if (timeLeft <= 0) {
				this.remainingTime = this.formatTime(0);
				clearInterval(this.intervalId);
			} else {
				this.remainingTime = this.formatTime(timeLeft);
			}
		}, 1000);
	}
	
	public formatTime(ms: number): string {
		const seconds = Math.floor((ms / 1000) % 60).toString().padStart(2, '0');
		const minutes = Math.floor((ms / 1000 / 60) % 60).toString().padStart(2, '0');
		const hours = Math.floor(ms / 1000 / 60 / 60).toString().padStart(2, '0');
		return `${hours}:${minutes}:${seconds}`;
	}
}

import { Component, inject, Input } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { AppState } from '../../../services/app-state.service';

@Component({
	selector: 'app-balance-values',
	templateUrl: './balance-values.component.html',
	styleUrl: './balance-values.component.scss'
})
export class BalanceValuesComponent {
	private readonly appState = inject(AppState);
	private readonly userService = inject(UserService);
	
	public user$ = this.userService.user$;
	public currentCurrency$ = this.appState.currency$;
	
	@Input() showCurrentCurrency: boolean = false;
	@Input() showWithdrawalValue: boolean = true;
	@Input() showTotalBalance: boolean = true;
}

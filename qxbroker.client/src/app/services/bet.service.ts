import { inject, Injectable } from '@angular/core';
import { ApiClient } from './api/api.client';
import { CreateBetRequest } from '../models/requests/create-bet-request.model';
import { BetModel } from '../models/bet.model';
import { BehaviorSubject } from 'rxjs';
import { AppState } from './app-state.service';
import { AccountType } from '../enums/account-type.enum';

@Injectable({
    providedIn: 'root',
})
export class BetService {
    private readonly apiClient = inject(ApiClient);
    private readonly appState = inject(AppState);

    public betsSubject = new BehaviorSubject<BetModel[]>([]);

    constructor() {
        // Подписка на изменения accountType
        this.appState.accountType$.subscribe(async (accountType) => {
            await this.updateBets(accountType);
        });
    }

    public async createBet(request: CreateBetRequest) {
        return this.apiClient.post('Bet/open-bet', request);
    }

    public async getBetHistory(accountType: AccountType): Promise<BetModel[]> {
        const isDemo = accountType === AccountType.Demo;
        const bets = await this.apiClient.getQuery('Bet/get-history', {
            isDemo: isDemo,
        });
        return bets.map((bet: BetModel) => new BetModel(bet));
    }

    public async getInProceedBet(
        accountType: AccountType
    ): Promise<BetModel[]> {
        const isDemo = accountType === AccountType.Demo;
        const bets = await this.apiClient.getQuery('Bet/get-inProceed', {
            isDemo: isDemo,
        });
        return bets.map((bet: BetModel) => new BetModel(bet));
    }

    private async updateBets(accountType: AccountType) {
        const bets = await this.getBetHistory(accountType);
        this.betsSubject.next(bets);
    }

    public async getBetHistoryWithQuery(
        accountType: AccountType,
        startDate: Date,
        endDate: Date
    ): Promise<BetModel[]> {
        const isDemo = accountType === AccountType.Demo;
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];

        const bets = await this.apiClient.getQuery(
            'Bet/get-history-sort-date',
            {
                isDemo: isDemo,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
            }
        );

        return bets.map((bet: BetModel) => new BetModel(bet));
    }
}

import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BetModel, BetType } from '../../models/bet.model';
import { BetService } from '../../services/bet.service';
import { Subscription } from 'rxjs';
import { SignalrService } from '../../services/signalr.service';
import { TradeChartComponent } from '../trade-chart/trade-chart.component';
import { TradeSidebarComponent } from '../trade-sidebar/trade-sidebar.component';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { TradesAlertService } from '../../services/trades-alert.service';

@Component({
    selector: 'app-trade-page',
    templateUrl: './trade-page.component.html',
    styleUrl: './trade-page.component.scss',
})
export class TradePageComponent implements OnInit, OnDestroy {
    private readonly betService = inject(BetService);
    private readonly signalrService = inject(SignalrService);
    private readonly userService = inject(UserService);
    private readonly alertService = inject(AlertService);
    private readonly tradersAlertService = inject(TradesAlertService);

    public bets: BetModel[] = [];

    @ViewChild(TradeChartComponent) tradeChartComponent!: TradeChartComponent;
    @ViewChild(TradeSidebarComponent)
    tradeSidebarComponent!: TradeSidebarComponent;

    private betOpenedSubscription!: Subscription;
    private betClosedSubscription!: Subscription;

    public selectedCurrency: string = 'BTCUSDT';

    public ngOnInit() {
        this.setBetOpenedListener();
        this.setBetResultListener();
    }

    public setBetOpenedListener(): void {
        this.betOpenedSubscription = this.signalrService.betOpened$.subscribe(
            (bet: BetModel) => {
                console.log('Received opened bet:', bet);

                if (this.selectedCurrency == bet.pair) {
                    const openTimeDate = new Date(bet.openTime!);
                    openTimeDate.setSeconds(0, 0);
                    const openTime = Math.floor(openTimeDate.getTime() / 1000);

                    const closeTimeDate = new Date(bet.closeTime!);
                    const closeAlert = closeTimeDate.getTime();
                    closeTimeDate.setSeconds(0, 0);
                    const closeTime = Math.floor(
                        closeTimeDate.getTime() / 1000
                    );

                    this.tradeChartComponent.addBetOnChart(
                        bet.amount,
                        bet.openPrice,
                        openTime,
                        closeTime,
                        closeAlert,
                        bet.betType ? bet.betType : BetType.Up
                    );
                }

                const trades = this.betService.betsSubject.getValue();
                this.betService.betsSubject.next([bet, ...trades]);
                // this.tradeSidebarComponent.trades = [...this.tradeSidebarComponent.trades, bet];
                // this.tradeSidebarComponent.cd.detectChanges();

                this.alertService.showAlert({
                    type: 'success',
                    text: `Trade opened with price: ${bet.openPrice} ${bet.pair}`,
                });
            }
        );
    }

    public setBetResultListener(): void {
        this.betClosedSubscription = this.signalrService.betClosed$.subscribe(
            (bet: BetModel) => {
                console.log('Received closed bet:', bet);
                const trades = this.betService.betsSubject.getValue();
                const updatedTrades = trades.map((trade) => {
                    return trade.id === bet.id ? bet : trade;
                });
                this.betService.betsSubject.next(updatedTrades);
                this.userService.getUser();

                this.tradersAlertService.showAlert({
                    type: 'trades-notifications',
                    flags: { from: 'anu', to: 'piz' },
                    time: bet.duration,
                    amount: bet.income,
                });
            }
        );
    }

    public ngOnDestroy() {
        if (this.betOpenedSubscription) {
            this.betOpenedSubscription.unsubscribe();
        }
        if (this.betClosedSubscription) {
            this.betClosedSubscription.unsubscribe();
        }
    }
}

import { trigger, transition, animate, keyframes, style } from '@angular/animations';
import { ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { BetModel, BetStatus, BetType } from '../../models/bet.model';
import { BetService } from '../../services/bet.service';
import { interval, map, Subscription } from 'rxjs';
import { KeyValue } from '@angular/common';

@Component({
    selector: 'app-trade-sidebar',
    templateUrl: './trade-sidebar.component.html',
    styleUrl: './trade-sidebar.component.scss',
    animations: [
        trigger('usermenuFadeIn', [
            transition(':enter', [
                animate(
                    '.2s linear',
                    keyframes([
                        style({ opacity: 0, top: '100%', offset: 0 }),
                        style({ opacity: 0, top: '100%', offset: 0.01 }),
                        style({ opacity: 1, top: 'calc(100% + 8px)', offset: 1 })
                    ])
                )
            ])
        ])
    ]
})
export class TradeSidebarComponent implements OnInit, OnDestroy {
    public readonly cd = inject(ChangeDetectorRef);
    private readonly betService = inject(BetService);

    @Input() public selectedCurrency = '';

    private betSubscription: Subscription;
    private timerIntervalSubscription!: Subscription;

    public dealListToggled: boolean = true;
    public dealListType: DealListType = 'trades';
    public BetType = BetType;
    public BetStatus = BetStatus;

    public trades: BetModel[] = [];
    public orders = [];

    public groupedBets: { [key: string]: { count: number, bets: BetModel[] } } = {};

    public constructor() {
        this.betSubscription = this.betService.betsSubject.subscribe(bets => {
            this.trades = bets;
            this.groupBetsByDate();
            this.startTimers();
        });
    }

    public ngOnInit() {
        // this.loadBets()
        // .then(() => this.groupBetsByDate());
    }

    public ngOnDestroy(): void {
        this.betSubscription.unsubscribe();
        this.timerIntervalSubscription.unsubscribe();
    }

    // public async loadBets() {
    //     try {
    //         this.trades = await this.betService.getBetHistory();
    //     }
    //     catch {
    //         this.trades = [];
    //     }
    // }

    public groupBetsByDate(): void {
        this.groupedBets = this.trades.reduce((acc, trade) => {
            const formattedDate = new Date(trade.openTime || 0).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }); // Форматируем дату

            if (!acc[formattedDate]) {
                acc[formattedDate] = { count: 0, bets: [] };
            }
            acc[formattedDate].bets.push(trade);
            acc[formattedDate].count++; // Увеличиваем количество сделок
            return acc;
        }, {} as { [date: string]: { count: number, bets: BetModel[] }});
    }

    public sortDatesDesc(a: KeyValue<string, any>, b: KeyValue<string, any>): number {
        const dateA = new Date(a.key).getTime();
        const dateB = new Date(b.key).getTime();
        return dateB - dateA;
    }

    private startTimers(): void {
        if (this.timerIntervalSubscription) {
            this.timerIntervalSubscription.unsubscribe(); // Удаляем предыдущий таймер
        }

        // Обновляем оставшееся время каждую секунду
        this.timerIntervalSubscription = interval(1000)
            .subscribe(() => {
                this.cd.detectChanges();
            });
    }

    public getRemainingTime(trade: BetModel): number {
        const elapsed = Math.floor((Date.now() - new Date(trade.openTime || '').getTime()) / 1000);
        const remaining = trade.duration - elapsed;

        return remaining > 0 ? remaining : 0;
    }

    public toggleDetails(bet: BetModel): void {
        bet.isDetailsVisible = !bet.isDetailsVisible;
    }

    public switchDealListType(dealListType: DealListType): void {
        if (this.dealListType === dealListType) {
            return;
        }

        this.dealListType = dealListType;
    }

    public toggleDealList(): void {
        this.dealListToggled = !this.dealListToggled;
    }

    public convertDurationToHHMMSS(seconds: number): string {
        if (seconds <= 0) {
            return '00:00:00';
        }

        const hours = Math.floor(seconds / 3600); // Часы
        const minutes = Math.floor((seconds % 3600) / 60); // Минуты
        const remainingSeconds = seconds % 60; // Секунды

        // Форматируем с ведущими нулями
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
}

export type DealListType = 'trades' | 'orders';

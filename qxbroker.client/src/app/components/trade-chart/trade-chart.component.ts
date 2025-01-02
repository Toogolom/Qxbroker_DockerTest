import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { createChart, IChartApi, CandlestickData, ColorType, CrosshairMode } from 'lightweight-charts';
import { ExpiringPriceAlerts } from '../../../ext_lib/lightweight-charts/plugins/expiring-price-alerts/expiring-price-alerts';
import { BinanceSocketService } from '../../services/binance-web-socket.service';
import { AppState } from '../../services/app-state.service';
import { BetModel, BetType } from '../../models/bet.model';
import { BetService } from '../../services/bet.service';
import { AccountType } from '../../enums/account-type.enum';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-trade-chart',
    templateUrl: './trade-chart.component.html',
    styleUrl: './trade-chart.component.scss'
})
export class TradeChartComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() public selectedCurrency: string = '';
    @Output() selectedCurrencyChange = new EventEmitter<string>();

    private readonly betService = inject(BetService);
    private readonly appState = inject(AppState);

    private chart: IChartApi | undefined;
    private series: any;
    private priceAlerts!: ExpiringPriceAlerts;
    private binanceSubscription: any;
    private accountTypeSubscription: Subscription | undefined;

    public accountType = this.appState.accountType$.asObservable();

    public isDropdownOpen = false;

    public inProceedBets: BetModel[] = [];

    constructor(
        private elRef: ElementRef,
        private binanceSocketService: BinanceSocketService,
        private cd: ChangeDetectorRef,
    ) { }

    public ngOnInit(): void {
        this.initializeChart();
        this.calculateTabWidth();
        this.loadHistoricalData(this.selectedCurrency);
        this.initializePriceAlerts();
        this.initActivePriceAlerts();

        this.accountTypeSubscription = this.appState.accountType$.subscribe(() => {
            this.clearPriceAlerts();

            this.initializePriceAlerts();
            this.initActivePriceAlerts();
        });
    }

    public ngAfterViewInit(): void { }

    private initializeChart(): void {
        const container = this.elRef.nativeElement.querySelector('#chart-container');
        const chartOptions = {
            layout: {
                textColor: 'white',
                background: { type: ColorType.Solid, color: '#1c1f2d' },
            },
            height: 800,
            width: 1000,
            autoSize: true,
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            grid: {
                vertLines: {
                    color: '#353A4D',
                },
                horzLines: {
                    color: '#353A4D',
                }
            },
            timeScale: {
                tickMarkFormatter: (time: any) => {
                    const date = new Date(time * 1000);
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    return `${hours}:${minutes}`;
                },
            }
        };
        this.chart = createChart(container, chartOptions);

        this.series = this.chart.addCandlestickSeries({
            upColor: '#13A058',
            downColor: '#E75B52',
            borderVisible: false,
            wickUpColor: '#13A058',
            wickDownColor: '#E75B52',
        });
    }

    private initializePriceAlerts(): void {
        this.priceAlerts = new ExpiringPriceAlerts(this.series, { interval: 60 });
    }

    public async initActivePriceAlerts(): Promise<void> {
        try {
            const accountType = this.appState.accountType$.getValue();
            this.inProceedBets = await this.betService.getInProceedBet(accountType);

            const btcBets = this.inProceedBets.filter((bet: BetModel) => bet.pair === this.selectedCurrency);

            btcBets.map((bet: BetModel) => {
                const openTimeDate = new Date(bet.openTime!);
                openTimeDate.setSeconds(0, 0);
                const openTime = Math.floor(openTimeDate.getTime() / 1000);

                const closeTimeDate = new Date(bet.closeTime!);
                closeTimeDate.setSeconds(0, 0);
                const closeTime = Math.floor(closeTimeDate.getTime() / 1000);

                const closeAlert = closeTimeDate.getTime();

                this.addBetOnChart(
                    bet.amount,
                    bet.openPrice,
                    openTime,
                    closeTime,
                    closeAlert,
                    bet.betType ? bet.betType : BetType.Up
                );
            });
        } catch {
            this.inProceedBets = [];
        }
    }

    private loadHistoricalData(symbol: string): void {
        this.binanceSocketService.getHistoricalData(symbol, '1m', 1000).subscribe((data) => {
            const historicalCandlesticks = data.map((kline: any[]) => ({
                time: kline[0] / 1000,
                open: parseFloat(kline[1]),
                high: parseFloat(kline[2]),
                low: parseFloat(kline[3]),
                close: parseFloat(kline[4])
            } as CandlestickData));

            this.series.setData(historicalCandlesticks);
            this.startSocketConnection(symbol);
        });
    }

    private startSocketConnection(symbol: string): void {
        if (this.binanceSubscription) {
            this.binanceSubscription.unsubscribe();
        }
        this.binanceSocketService.disconnect();

        this.binanceSubscription = this.binanceSocketService.connect(symbol.toLowerCase()).subscribe((data) => {
            const kline = data.k;
            const candlestick = {
                time: kline.t / 1000,
                open: parseFloat(kline.o),
                high: parseFloat(kline.h),
                low: parseFloat(kline.l),
                close: parseFloat(kline.c)
            };

            this.series.update(candlestick);
        });
    }

    public selectCurrency(currency: string): void {
        this.selectedCurrency = currency;
        this.appState.tradeChartCurrency$.next(currency);
        this.isDropdownOpen = false;

        if (this.binanceSubscription) {
            this.binanceSubscription.unsubscribe();
        }
        this.binanceSocketService.disconnect();

        this.selectedCurrencyChange.emit(currency);

        this.loadHistoricalData(currency);

        // Очистка старых алертов
        this.clearPriceAlerts();

        // Инициализация новых алертов
        this.initializePriceAlerts();
        this.initActivePriceAlerts();
    }

    public addBetOnChart(amount: number, price: number, openTime: number, closeTime: number, timeStop: number, type: BetType): void {
        if (!this.priceAlerts || !this.series) return;

        this.priceAlerts.addExpiringAlert(
            price,
            openTime,
            closeTime,
            timeStop,
            {
                //@ts-ignore
                crossingDirection: type.toLocaleLowerCase(),
                title: `${amount} $`,
            }
        );
    }

    private clearPriceAlerts(): void {
        if (this.priceAlerts) {
            this.priceAlerts.destroy();
        }
    }

    //#region Dropdown
    public tabOffset: number = 0;
    public tabWidth: number = 148;
    public containerWidth: number = 0;

    public tradePairsList = [
        { name: 'Bitcoin', code: 'BTCUSDT', isFavorite: true, changePercent: 2.02, profitFromOneMin: 89, profitFromFiveMin: 93, selected: true, tradePairType: 'crypto' },
        { name: "Etherium", code: 'ETHUSDT', isFavorite: false, changePercent: 1.11, profitFromOneMin: 88, profitFromFiveMin: 53, selected: true, tradePairType: 'crypto' },
        { name: 'A', code: 'BTCUSDT1', isFavorite: true, changePercent: 2.22, profitFromOneMin: 85, profitFromFiveMin: 24, selected: false, tradePairType: 'crypto' },
        { name: "B", code: 'ETHUSDT2', isFavorite: false, changePercent: 1.07, profitFromOneMin: 83, profitFromFiveMin: 99, selected: false, tradePairType: 'crypto' }
    ];

    public selectedTradePairs = this.tradePairsList.filter(x => x.selected === true);

    public toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    @HostListener('window:resize', ['$event'])
    public onResize(event: Event) {
        this.calculateTabWidth();
    }

    public calculateTabWidth() {
        //@ts-ignore
        this.containerWidth = document.querySelector('.chart-container')?.clientWidth - 140 || 0;
        const totalTabs = this.selectedTradePairs.length;
        this.tabOffset = Math.min((this.containerWidth - this.tabWidth) / (totalTabs - 1), this.tabWidth);
    }

    // TODO: возможно нужна другая логика
    public getLeftPosition(index: number): string {
        //@ts-ignore
        const activeTabIndex = this.selectedTradePairs.findIndex(tab => tab.code === this.selectedCurrency);

        if (index <= activeTabIndex) {
            return `${index * this.tabOffset}px`;
        } else {
            const remainingWidth = this.containerWidth - (activeTabIndex + 1) * this.tabOffset - this.tabWidth;
            const tabsAfterActive = this.selectedTradePairs.length - activeTabIndex - 1;
            const newOffset = remainingWidth / tabsAfterActive;
            const offset = Math.min(newOffset, this.tabWidth);

            return `${activeTabIndex * this.tabOffset + this.tabWidth + (index - activeTabIndex - 1) * offset}px`;
        }
    }

    public selectPair(pair: any): void {
        if (pair.selected) {
            this.selectCurrency(pair.code);
            return;
        }

        pair.selected = true;
        this.selectedTradePairs.push(pair);
        this.selectCurrency(pair.code);
    }

    public deselectPair(pair: any): void {
        pair.selected = false;

        let lastItem = pair;
        this.selectedTradePairs = this.selectedTradePairs.filter(x => x.code !== pair.code);
        lastItem = this.selectedTradePairs.length > 0 ? this.selectedTradePairs[this.selectedTradePairs.length - 1] : lastItem;

        this.selectCurrency(lastItem.code);
        this.cd.detectChanges();
    }

    public toggleFavorite(pair: any): void {
        pair.isFavorite = !pair.isFavorite;
    }

    public favoritePair(pair: any) {
        // To api
    }
    //#endregion

    public ngOnDestroy(): void {
        if (this.binanceSubscription) {
            this.binanceSubscription.unsubscribe();
        }
        this.binanceSocketService.disconnect();
    }
}

export type TradePairType = 'currencies' | 'crypto' | 'commodities' | 'stocks';

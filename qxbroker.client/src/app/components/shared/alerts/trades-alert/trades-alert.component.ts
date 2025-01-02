import { ChangeDetectorRef, Component } from '@angular/core';
import {
    ITradesAlertInfo,
    TradesAlertService,
} from '../../../../services/trades-alert.service';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-trades-alert',
    templateUrl: './trades-alert.component.html',
})
export class TradesAlertComponent {
    public model: ITradesAlertInfo[] = [];
    public event = new Subject<void>();
    public customText = '';

    private interval = 0;
    public readonly autoHideTimeout = 3200;

    private subscription = new Subscription();
    private eventSubscription = new Subscription();

    constructor(
        private readonly alertService: TradesAlertService,
        protected cdr: ChangeDetectorRef
    ) {}

    public async ngOnInit(): Promise<void> {
        this.subscription = this.alertService.alerts.subscribe((x) => {
            this.model = x;
            this.cdr.detectChanges();
        });
        this.customText = '';
    }

    public close(alert: ITradesAlertInfo): void {
        this.alertService.closeAlert(alert);
    }

    public convertDurationToHHMMSS(seconds: number | undefined): string {
        if (!seconds) {
            return '00:00:00';
        }
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

    public ngOnDestroy(): void {
        this.subscription?.unsubscribe();
        this.eventSubscription?.unsubscribe();
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}

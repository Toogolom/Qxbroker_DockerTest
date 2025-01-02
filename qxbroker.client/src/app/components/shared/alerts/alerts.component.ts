import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AlertService, IAlertInfo } from '../../../services/alert.service';

@Component({
    selector: 'app-alerts',
    templateUrl: './alerts.component.html',
})
export class AlertComponent implements OnInit, OnDestroy {
    public model: IAlertInfo[] = [];
    public event = new Subject<void>();
    public customText = '';

    private interval = 0;
    public readonly autoHideTimeout = 3200;

    private subscription = new Subscription;
    private eventSubscription = new Subscription;

    constructor(
        private readonly alertService: AlertService,
        protected cdr: ChangeDetectorRef
    ) { }

    public async ngOnInit(): Promise<void> {
        this.subscription = this.alertService.alerts
            .subscribe(x => {
                this.model = x;
                this.cdr.detectChanges();
            });
        this.customText = '';
    }

    public close(alert: IAlertInfo): void {
        this.alertService.closeAlert(alert);
    }

    public ngOnDestroy(): void {
        this.subscription?.unsubscribe();
        this.eventSubscription?.unsubscribe();
        if (this.interval) { clearInterval(this.interval); }
    }
}

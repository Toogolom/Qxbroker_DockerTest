import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ThrottlingExecutor } from '../../../../utils/throttling-utils';
import Guid from '../../../../models/guid.model';

@Component({
    selector: 'app-close-btn-with-timer',
    templateUrl: './close-btn-with-timer.component.html'
})
export class CloseBtnWithTimerComponent implements OnInit, OnDestroy {
    @Input() public timeLimitInMS = 0;
    @Input() public event = new Observable<void>;
    @Output() public readonly timeElapsed = new EventEmitter();

    private readonly UPDATE_DELAY = 100;

    public readonly id = Guid.newGuid();
    private executor = new ThrottlingExecutor();

    private timeLeft = 0;
    private timerId = 0;

    private eventSubscription = new Subscription;

    public ngOnInit(): void {
        this.eventSubscription = this.event.subscribe(() => this.restartTimer());
        this.executor.schedule(() => {
            this.startTimer();
        });
    }

    public ngOnDestroy(): void {
        this.eventSubscription.unsubscribe();
    }

    private startTimer(): void {
        let timePassed = 0;
        this.timerId = window.setInterval(() => {
            timePassed = timePassed + this.UPDATE_DELAY;
            this.timeLeft = this.timeLimitInMS - timePassed;

            if (this.timeLeft <= 0) {
                window.clearInterval(this.timerId);
                this.stopTimer();
            }
        }, this.UPDATE_DELAY);
    }

    public stopTimer(): void {
        window.clearInterval(this.timerId);
        this.timeElapsed.emit();
    }

    private restartTimer(): void {
        window.clearInterval(this.timerId);
        this.timeLeft = this.timeLimitInMS;
        this.startTimer();
    }
}

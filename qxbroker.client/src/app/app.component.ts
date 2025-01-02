import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SignalrService } from './services/signalr.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    private authSubscription = new Subscription();

    constructor(
        private readonly translateService: TranslateService,
        private readonly authService: AuthService,
        private readonly signalrService: SignalrService
    ) {
        this.translateService.use(localStorage.getItem('lang') || 'en');
    }

    public get isAuth() {
        return this.authService.isAuth;
    }

    public ngOnInit() {
        if (!this.authService.isAuth && this.signalrService.isConnected()) {
            this.signalrService.stopConnection();
        }

        this.authSubscription = this.authService.isAuth$.subscribe(isAuth => {
            if (isAuth) {
                this.signalrService.startConnection();

                this.signalrService.betOpenedListener();
                this.signalrService.betResultListener();
            } else {
                this.signalrService.stopConnection();
            }
        });
    }

    public ngOnDestroy() {
        this.authSubscription.unsubscribe();
        this.signalrService.stopConnection();
    }
}

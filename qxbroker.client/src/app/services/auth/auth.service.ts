import { Injectable } from '@angular/core';
import { ApiClient } from '../api/api.client';
import { LoginRequest } from '../../models/requests/login-request.model';
import { ITokenModel, TokenModel } from '../../models/auth/token.model';
import { SendConfirmEmailRequest } from '../../models/requests/send-confirm-email-request.model';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { SendRecoveryPasswordRequest } from '../../models/requests/send-recovery-password-request.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthSubject: BehaviorSubject<boolean>;
    public isAuth$: Observable<boolean>;

    constructor(
        private readonly api: ApiClient,
        private cookieService: CookieService,
        private router: Router,
        protected readonly http: HttpClient,
    ) {
        this.isAuthSubject = new BehaviorSubject<boolean>(!!this.accessToken);
        this.isAuth$ = this.isAuthSubject.asObservable();
    }

    public get isAuth() {
        return !!this.accessToken;
    }

    public get accessToken() {
        return this.cookieService.get('accessToken');
    }

    public set accessToken(accessToken: string) {
        this.cookieService.set('accessToken', accessToken);
    }

    public get refreshToken() {
        return this.cookieService.get('refreshToken');
    }

    public set refreshToken(refreshToken: string) {
        this.cookieService.set('refreshToken', refreshToken);
    }

    public async login(request: LoginRequest): Promise<TokenModel | null> {
        const tokenData = await this.api.post('Auth/login', request).then(data => new TokenModel(data));
        this.accessToken = tokenData.accessToken;
        this.refreshToken = tokenData.refreshToken;
        this.isAuthSubject.next(true);

        return tokenData;
    }

    public async sendConfirmEmail(request: SendConfirmEmailRequest): Promise<null> {
        return await this.api.post('Auth/send-confirm-email', request);
    }

    public async confirmEmail(): Promise<void> {
        const tokenData = await this.api.post('Auth/confirm-email').then(data => new TokenModel(data));
        this.accessToken = tokenData.accessToken;
        this.refreshToken = tokenData.refreshToken;
    }

    public async recoverPasswordRequest(request: SendRecoveryPasswordRequest): Promise<void> {
        return await this.api.post("Auth/send-recovery-password-email", request);
    }

    public async recoverPassword(token: string, password: string): Promise<void> {
        return await this.api.post("Auth/recovery-password", { token: token, password: password });
    }

    public refreshAuthToken() {
        return this.http.post<ITokenModel>('https://localhost:7109/api/Auth/refresh', { refreshToken: this.refreshToken })
        .pipe(
            tap(val => {
                this.accessToken = val.accessToken;
                this.refreshToken = val.refreshToken;
            }),
            catchError(err => {
                this.logout();
                return throwError(err)
            })
        )
    }

    // TODO: need refactor logout not work
    public logout() {
        const token: ITokenModel = {
            accessToken: this.accessToken,
            refreshToken: this.refreshToken
        };

        this.api.post('Auth/logout', token).then(() => {
            this.cookieService.deleteAll();
            this.isAuthSubject.next(false);

            this.router.navigate(['/sign-in']).then(navigated => {
                if (navigated) {
                    console.log('Успешный переход на страницу /sign-in');
                } else {
                    console.error('Не удалось перейти на /sign-in');
                }
            });
        }).catch(error => {
            console.error('Ошибка при попытке выйти:', error);
        });
    }

}

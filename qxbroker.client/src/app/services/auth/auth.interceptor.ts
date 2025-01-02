import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { catchError, switchMap, throwError } from "rxjs";

let isRefreshing = false;

export const authTokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next) => {
    const authService = inject(AuthService);
    const token = authService.accessToken;

    const isBinanceApiRequest = req.url.includes('https://api.binance.com');

    if (!token || isBinanceApiRequest) {
        return next(req);
    }

    if (isRefreshing) {
        return refreshAndProceed(authService, req, next);
    }

    return next(addToken(req, token))
        .pipe(
            catchError(error => {
                if (error.status === 401) {
                    return refreshAndProceed(authService, req, next);
                }

                return throwError(error)
            })
        )
}

const refreshAndProceed = (authService: AuthService, req: HttpRequest<any>, next: HttpHandlerFn) => {
    if (!isRefreshing) {
        isRefreshing = true;

        return (authService.refreshAuthToken())
        .pipe(
            switchMap((res) => {
                isRefreshing = false;
                return next(addToken(req, res.accessToken))
            })
        );
    }

    return next(addToken(req, authService.accessToken))
}

const addToken = (req: HttpRequest<any>, token: string) => {
    return req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`
        }
    });
}

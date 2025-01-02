/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiClient {
    constructor(
        protected readonly http: HttpClient,
        protected readonly zone: NgZone
    ) {
    }

    private apiBaseUrl = environment.apiBaseUrl + '/api';
    protected readonly unsubscribe$ = new Subject<void>();

    public get<TResult = any>(url: string, silent?: boolean, full: boolean = false): Promise<TResult | null> {
        const observable = this.http.get(`${this.apiBaseUrl}/${url}`, { headers: this.getHeaders(), observe: 'response', withCredentials: true  }) as any as Observable<HttpResponse<TResult>>;
        return this.subscribe<TResult>(observable, silent, full);
    }

    public post(url: string, data?: unknown, silent?: boolean): Promise<any> {
        if (!data) {
            data = {};
        }

        const isFormData = data instanceof FormData;

        const headers = isFormData
            ? this.getHeadersWithoutContentType()
            : this.getHeaders();

        const observable = this.http.post(
            `${this.apiBaseUrl}/${url}`,
            isFormData ? data : JSON.stringify(data),
            { headers, observe: 'response', withCredentials: true }
        );
        return this.subscribe(observable, silent);
    }

    public put(url: string, data: any, silent?: boolean): Promise<any> {
        const observable = this.http.put(`${this.apiBaseUrl}/${url}`, JSON.stringify(data), { headers: this.getHeaders(), observe: 'response', withCredentials: true });
        return this.subscribe(observable, silent);
    }

    public delete(url: string, silent?: boolean): Promise<any> {
        const observable = this.http.delete(`${this.apiBaseUrl}/${url}`, {
            headers: this.getHeaders(),
            observe: 'response',
            withCredentials: true
        });
        return this.subscribe(observable, silent);
    }

    public getArrayQuery(url: string, params: any | null, silent?: boolean): Promise<any> {
        const httpParams = this.getHttpArrayParams(params);
        const observable = this.http.get(`${this.apiBaseUrl}/${url}`, { headers: this.getHeaders(), params: httpParams, observe: 'response', withCredentials: true  });
        return this.subscribe(observable, silent);
    }

    public getText<TResult = any>(url: string, silent?: boolean, full: boolean = false): Promise<TResult | null> {
        const observable = this.http.get(`${this.apiBaseUrl}/${url}`, {
            headers: this.getHeaders(),
            observe: 'response',
            responseType: 'text'
        }) as any as Observable<HttpResponse<TResult>>;
        return this.subscribe<TResult>(observable, silent, full);
    }

    public getQuery(url: string, params: any | null, silent?: boolean): Promise<any> {
        const httpParams = this.getHttpParams(params);
        const observable = this.http.get(`${this.apiBaseUrl}/${url}`, { headers: this.getHeaders(), params: httpParams, observe: 'response', withCredentials: true  });
        return this.subscribe(observable, silent);
    }

    protected subscribe<TResult = any>(
        observable: Observable<HttpResponse<TResult>>,
        silent?: boolean,
        full: boolean = false
    ): Promise<TResult | null>  {
        const promise = new Promise<TResult | null>((resolve, reject) => {
            observable
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe({
                    next: val => {
                        setTimeout(() => {
                            this.zone.run(() => {
                                resolve(full ? val as any as TResult : val.body);
                            });
                        });
                    },
                    error: err => {
                        console.log(err);
                        reject(err);
                    }
                });
        });

        return promise;
    }

    protected getHttpParams(params: any | null): HttpParams {
        let httpParams = new HttpParams();
        if (params != null) {
            Object.keys(params).forEach(key => {
                const value = params[key];
                if (value instanceof Array) {
                    value.forEach(item => {
                        httpParams = httpParams.append(key, item);
                    });
                } else if (value instanceof Date) {
                    httpParams = httpParams.append(key, value.toISOString());
                } else if (value !== null && value !== undefined) {
                    httpParams = httpParams.append(key, value);
                }
            });
        }

        return httpParams;
    }

    protected getHttpArrayParams(params: any | null): HttpParams {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('ids', params.join(', '));

        return httpParams;
    }

    protected getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'content-type': 'application/json',
            'cache-control': 'no-cache'
        });
    }

    protected getHeadersWithoutContentType(): HttpHeaders {
        return new HttpHeaders({
            'cache-control': 'no-cache',
        });
    }

    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}


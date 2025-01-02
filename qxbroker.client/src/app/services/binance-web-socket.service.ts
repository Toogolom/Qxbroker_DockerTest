import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BinanceSocketService {
    private socket: WebSocket | undefined;
    private subject: Subject<any>;

    constructor(
        private http: HttpClient
    ) {
        this.subject = new Subject<any>();
    }

    public connect(symbol: string = 'btcusdt'): Observable<any> {
        const streamName = `${symbol.toLowerCase()}`;
        const wsUrl = `wss://stream.binance.com:9443/ws/${streamName}` + '@kline_' + '1m';

        this.socket = new WebSocket(wsUrl);

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.subject.next(data);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error', error);
        };

        return this.subject.asObservable();
    }

    public getHistoricalData(symbol: string = 'BTCUSDT', interval: string = '1m', limit: number = 500): Observable<any> {
        const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
        return this.http.get(url);
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = undefined;
        }
    }
}

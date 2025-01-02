import { Injectable } from '@angular/core';
import * as signalr from '@aspnet/signalr';
import { environment } from '../../environments/environment';
import { BetModel } from '../models/bet.model';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SignalrService {
    private hubConnection!: signalr.HubConnection;
    private connected = false;

    public betOpened$ = new Subject<BetModel>();
    public betClosed$ = new Subject<BetModel>();

    constructor() { }

    public startConnection() {
        this.hubConnection = new signalr.HubConnectionBuilder()
            .withUrl(environment.wsConnectionUrl, {
                skipNegotiation: true,
                transport: signalr.HttpTransportType.WebSockets
            })
            .build();

        this.hubConnection
            .start()
            .then(() => {
                this.connected = true;
                console.log('Hub connection Started');
            })
            .catch(err => {
                this.connected = false;
                console.log('Error while starting connection: ' + err);
            });
    }

    public sendBetOpen(bet: BetModel) {
        this.hubConnection.invoke('SendBetOpen', bet)
            .catch(err => console.error(err));
    }

    public betOpenedListener() {
        this.hubConnection.on('BetOpened', (bet: BetModel) => {
            this.betOpened$.next(bet);
        });
    }

    public betResultListener() {
        this.hubConnection.on('BetClosed', (bet: BetModel) => {
            this.betClosed$.next(bet);
        });
    }

    public stopConnection() {
        if (this.hubConnection) {
            this.hubConnection.stop()
                .then(() => {
                    this.connected = false;
                    console.log('Hub connection stopped');
                })
                .catch(err => console.error('Error stopping connection:', err));
            this.hubConnection.off('askServerResponse');
        }
    }

    public isConnected(): boolean {
        return this.connected;
    }
}

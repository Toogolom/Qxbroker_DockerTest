import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TradesAlertService {
    private readonly maxAlerts = 5;
    public alerts = new BehaviorSubject<ITradesAlertInfo[]>([]);

    public showAlert(alert: ITradesAlertInfo): void {
        alert.shownAt = new Date();
        const current = this.alerts.value;
        current.unshift(alert);
        if (current.length > this.maxAlerts) {
            current.pop();
        }
        this.alerts.next([...current]);
    }

    public closeAlert(alert: ITradesAlertInfo): void {
        const current = [...this.alerts.value]; // Создаем копию массива
        const index = current.findIndex((x) => x === alert);
    
        if (index > -1) {
            // Устанавливаем флаг для анимации
            current[index].isClosing = true;
            this.alerts.next(current);
    
            // Удаляем уведомление через 400 мс
            setTimeout(() => {
                const updated = this.alerts.value.filter((x) => x !== alert);
                this.alerts.next(updated);
            }, 400);
        }
    }
    

    public closeOlderThan(date: Date): void {
        const current = this.alerts.value;
        if (current.length == 0) return;

        const filtered = current.filter(x => x.shownAt == null || x.shownAt > date);
        if (filtered.length !== current.length) {
            this.alerts.next(filtered);
        }
    }
}

export interface ITradesAlertInfo {
    type: 'trades-notifications';
    text?: string;
    shownAt?: Date;
    isClosing?: boolean;
    flags?: { from: string; to: string };
    time?: number;
    amount?: number;
}

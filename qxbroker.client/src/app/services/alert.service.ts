import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertService {
    private readonly maxAlerts = 5;
    public alerts = new BehaviorSubject<IAlertInfo[]>([]);

    public showAlert(alert: IAlertInfo): void {
        alert.shownAt = new Date();
        const current = this.alerts.value;
        current.unshift(alert);
        if (current.length > this.maxAlerts) {
            current.pop();
        }
        this.alerts.next([...current]);
    }

    public closeAlert(alert: IAlertInfo): void {
        const current = this.alerts.value;

        // Устанавливаем флаг для анимации скрытия
        alert.isClosing = true;
        this.alerts.next([...current]);

        // Удаляем уведомление через 400 мс (время анимации скрытия)
        setTimeout(() => {
            this.alerts.next([...current.filter(x => x !== alert)]);
        }, 400); // Длительность анимации notificationHide
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

export interface IAlertInfo {
    type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
    text?: string;
    shownAt?: Date,
    isClosing?: boolean;
}

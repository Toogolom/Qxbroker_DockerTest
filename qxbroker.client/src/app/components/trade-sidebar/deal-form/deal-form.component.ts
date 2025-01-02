import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, Validators, AbstractControl, FormBuilder, FormControl } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AppState } from '../../../services/app-state.service';
import { BetType } from '../../../models/bet.model';
import { BetService } from '../../../services/bet.service';
import { CreateBetRequest } from '../../../models/requests/create-bet-request.model';
import { combineLatest } from 'rxjs';
import { AccountType } from '../../../enums/account-type.enum';

@Component({
    selector: 'app-deal-form',
    templateUrl: './deal-form.component.html',
    styleUrl: './deal-form.component.scss'
})
export class DealFormComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly userService = inject(UserService);
    private readonly appState = inject(AppState);
    private readonly betService = inject(BetService);

    public dealForm!: FormGroup;

    public InputTimeType = InputTimeType;
    public InputAmountType = InputAmountType;
    public inputTimeType: InputTimeType = InputTimeType.HoursMinutes;
    public inputAmountType: InputAmountType = InputAmountType.Currency;
    public balance: number = 0;
    public totalBalance: number = 0;
    public BetType = BetType;
    public accountType = this.appState.accountType$.asObservable();

    public tradePair: any = {};
    public showTimeDropdown: boolean = false;
    public hoursMinutes: string[] = [];
    public hoursMinutesSeconds: string[] = [
        '00:00:05', '00:00:10', '00:00:15',
        '00:00:30', '00:01:00', '00:02:00',
        '00:05:00', '00:10:00', '00:15:00',
        '00:30:00', '01:00:00',
    ];

    constructor() {
        combineLatest([
            this.appState.accountType$,
            this.userService.user$
        ])
        .subscribe(([type, userData]) => {
            if (type === 'demo') {
                this.balance = userData?.demoBalance || 0;
            } else {
                this.balance = userData?.totalBalance || 0;
            }
        });
    }

    public ngOnInit(): void {
        this.dealForm = this.fb.group({
            timer: new FormControl<string>("", [this.timeValidator()]),
            amount: new FormControl<number>(1, [this.investmentValidator()]),
        });

        setInterval(() => {
            this.updateTimes();
            if (this.inputTimeType === InputTimeType.HoursMinutes) {
                this.setCurrentTime();
            }
        }, 30000);

        // Устанавливаем текущее время, если тип времени - HoursMinutes
        if (this.inputTimeType === InputTimeType.HoursMinutes) {
            this.updateTimes();
            this.setCurrentTime();
        }

        // API method to get trade pair from selectedCurrency
        // Instead of it
        const tradePairsList = [
            { name: 'Bitcoin', code: 'BTCUSDT', isFavorite: true, changePercent: 2.02, profitFromOneMin: 89, profitFromFiveMin: 93, selected: true, tradePairType: 'crypto' },
            { name: "Etherium", code: 'ETHUSDT', isFavorite: false, changePercent: 1.11, profitFromOneMin: 88, profitFromFiveMin: 53, selected: true, tradePairType: 'crypto' },
            { name: 'A', code: 'BTCUSDT1', isFavorite: true, changePercent: 2.22, profitFromOneMin: 85, profitFromFiveMin: 24, selected: false, tradePairType: 'crypto' },
            { name: "B", code: 'ETHUSDT2', isFavorite: false, changePercent: 1.07, profitFromOneMin: 83, profitFromFiveMin: 99, selected: false, tradePairType: 'crypto' }
        ];

        this.tradePair = tradePairsList.find(x => x.code === this.appState.tradeChartCurrency$.getValue());
    }

    public get calculatePayout() {
        const amount = this.inputAmountType === InputAmountType.Currency
            ? this.dealForm.get('amount')?.value || 0
            : this.calculateInvestment;

        return amount * this.tradePair.profitFromOneMin / 100 + amount;
    }

    public get calculateInvestment() {
        if (this.inputAmountType === InputAmountType.Percent) {  
            return this.dealForm.get('amount')?.value / 100 * this.balance || 0;
        }

        return null;
    }

    private updateTimes(): void {
        const increments = [1, 2, 3, 4, 5, 6, 11, 16, 31, 46, 61, 121, 181];
        const now = new Date();
    
        this.hoursMinutes = increments.map(increment => {
            const newTime = new Date(now.getTime() + increment * 60 * 1000);
            const hours = newTime.getHours().toString().padStart(2, '0');
            const minutes = newTime.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        });
    }

    // Устанавливаем текущее время в формате HH:mm
    public setCurrentTime() {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 1);
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');

        this.dealForm.get('timer')?.setValue(`${hours}:${minutes}`);
    }

    // Метод для изменения типа инпута времени
    public changeTimeType(type: InputTimeType) {
        this.inputTimeType = type;
        if (type === InputTimeType.HoursMinutes) {
            this.setCurrentTime();
        } else {
            this.dealForm.get('timer')?.setValue('00:01:00');
        }
        this.dealForm.get('timer')?.updateValueAndValidity();
    }

    public openTimeDropdown() {
        this.showTimeDropdown = true;
    }

    public closeTimeDropdown() {
        this.showTimeDropdown = false;
    }

    public setTime(time: string, event: Event) {
        event?.stopPropagation();
        event.preventDefault();
        console.log('time',time);
        this.dealForm.get('timer')?.setValue(time);
        this.showTimeDropdown = false;
    }

    public formatTime(time: string): string {
        return time.startsWith('00:') ? time.substring(3) : time;
    }

    // Метод для изменения типа инпута инвестиции
    public changeAmountType(type: InputAmountType) {
        this.inputAmountType = type;

        if (type === InputAmountType.Percent) {
            this.dealForm.get('amount')?.addValidators([Validators.max(100)])
        } else {
            this.dealForm.get('amount')?.removeValidators([Validators.max(100)])
        }

        this.dealForm.get('amount')?.markAsTouched();
        this.dealForm.get('amount')?.markAsDirty();
        this.dealForm.get('amount')?.updateValueAndValidity();
    }

    // Уменьшить значение времени
    public decrementTime() {
        const timeControl = this.dealForm.get('timer');
        const timeValue = timeControl?.value || '';
        const [hours, minutes, seconds] = timeValue.split(':').map(Number);

        if (this.inputTimeType === InputTimeType.HoursMinutes) {
            const date = new Date();
            date.setHours(hours, minutes - 1);
            const newHours = date.getHours().toString().padStart(2, '0');
            const newMinutes = date.getMinutes().toString().padStart(2, '0');
            timeControl?.setValue(`${newHours}:${newMinutes}`);
        } else {
            const date = new Date();
            date.setHours(hours, minutes, (seconds || 0) - 1);
            const newHours = date.getHours().toString().padStart(2, '0');
            const newMinutes = date.getMinutes().toString().padStart(2, '0');
            const newSeconds = date.getSeconds().toString().padStart(2, '0');
            timeControl?.setValue(`${newHours}:${newMinutes}:${newSeconds}`);
        }
    }

    // Увеличить значение времени
    public incrementTime() {
        const timeControl = this.dealForm.get('timer');
        const timeValue = timeControl?.value || '';
        const [hours, minutes, seconds] = timeValue.split(':').map(Number);

        if (this.inputTimeType === InputTimeType.HoursMinutes) {
            const date = new Date();
            date.setHours(hours, minutes + 1);
            const newHours = date.getHours().toString().padStart(2, '0');
            const newMinutes = date.getMinutes().toString().padStart(2, '0');
            timeControl?.setValue(`${newHours}:${newMinutes}`);
        } else {
            const date = new Date();
            date.setHours(hours, minutes, (seconds || 0) + 1);
            const newHours = date.getHours().toString().padStart(2, '0');
            const newMinutes = date.getMinutes().toString().padStart(2, '0');
            const newSeconds = date.getSeconds().toString().padStart(2, '0');
            timeControl?.setValue(`${newHours}:${newMinutes}:${newSeconds}`);
        }
    }

    // Уменьшить значение инвестиции
    public decrementInvestment() {
        const investmentControl = this.dealForm.get('amount');
        let value = parseFloat(investmentControl?.value || '0');
        value = this.inputAmountType === InputAmountType.Currency ? Math.max(1, value - 1) : Math.max(1, value - 1);
        investmentControl?.setValue(value);
    }

    // Увеличить значение инвестиции
    public incrementInvestment() {
        const investmentControl = this.dealForm.get('amount');
        let value = parseFloat(investmentControl?.value || '0');
        if (this.inputAmountType === InputAmountType.Currency) {
            value = Math.min(3000, value + 1);
        } else if (this.inputAmountType === InputAmountType.Percent) {
            value = Math.min(100, value + 1);
        }
        investmentControl?.setValue(value);
    }

    // Валидатор для поля времени
    public timeValidator() {
        return (control: AbstractControl) => {
            const value = control.value;
            const timePattern = this.inputTimeType === InputTimeType.HoursMinutes
                ? /^([0-1]\d|2[0-3]):([0-5]\d)$/
                : /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
            return timePattern.test(value) ? null : { invalidTime: true };
        };
    }

    // Валидатор для поля инвестиции
    public investmentValidator() {
        return (control: AbstractControl) => {
            const value = parseFloat(control.value);
            if (this.inputAmountType === InputAmountType.Currency) {
                return value >= 1 && value <= this.balance ? null : { outOfRange: true };
            } else if (this.inputAmountType === InputAmountType.Percent) {
                if (value < 1) {
                    control.setValue(1);
                    return null;
                } else if (value > 100) {
                    control.setValue(100);
                    return null;
                }
            }
            return null;
        };
    }

    public async onCreateBet(type: BetType) {
        const amount = this.inputAmountType === InputAmountType.Currency
            ? this.dealForm.get('amount')?.value || 0
            : this.calculateInvestment;

        const time = this.dealForm.get('timer')?.value || '';

        let duration = 0; 
        if (this.inputTimeType === InputTimeType.HoursMinutesSeconds) {
            duration = this.timeToSeconds(time);
        } else  {
            const betTime = this.timeToDate(time);
            const now = new Date();
            const differenceInMilliseconds = betTime.getTime() - now.getTime();
            const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
            duration = differenceInSeconds;
        }

        if (duration <= 0) {
            console.error('Invalid close time. Choose another');
            return;
        }

        const createBetRequest: CreateBetRequest = {
            amount: amount,
            betType: type,
            pair: this.appState.tradeChartCurrency$.getValue(),
            time: duration,
            isDemo: this.appState.accountType$.getValue() === AccountType.Demo
        }
        await this.betService.createBet(createBetRequest).then( async () => await this.userService.getUser());
    }

    private timeToSeconds(time: string): number {
        const parts = time.split(':').map(Number);
        let hours = 0, minutes = 0, seconds = 0;
    
        // Формат HH:mm:ss
        hours = parts[0];
        minutes = parts[1];
        seconds = parts[2];

        return hours * 3600 + minutes * 60 + seconds;
    }

    private timeToDate(time: string): Date {
        const parts = time.split(':').map(Number);
        let hours = 0, minutes = 0, seconds = 0;
    
        hours = parts[0];
        minutes = parts[1];

        const now = new Date();
        // Создаем объект Date с текущей датой и заданным временем
        const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
    
        return targetDate;
    }
}


export enum InputTimeType {
    HoursMinutes = 1,
    HoursMinutesSeconds = 2,
}

export enum InputAmountType {
    Currency = 1,
    Percent = 2,
}

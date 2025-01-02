import { inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AccountType } from "../enums/account-type.enum";
import { UserService } from "./user.service";

@Injectable({
    providedIn: "root"
})
export class AppState {
    public accountType$ = new BehaviorSubject<AccountType>(AccountType.Live);
    public currency$ = new BehaviorSubject<string>("USD");
    public tradeChartCurrency$ = new BehaviorSubject<string>("BTCUSDT");
}
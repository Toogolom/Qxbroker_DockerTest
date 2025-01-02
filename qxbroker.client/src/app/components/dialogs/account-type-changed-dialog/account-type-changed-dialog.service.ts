import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AccountType } from "../../../enums/account-type.enum";

@Injectable({
    providedIn: 'root'
})
export class AccountTypeChangedDialogService {
    private dialogVisibleSubject = new BehaviorSubject<boolean>(false);
    dialogVisible$ = this.dialogVisibleSubject.asObservable();
  
    private accountTypeSubject = new BehaviorSubject<DialogData>(
        new DialogData(AccountType.Demo, AccountType.Live, 0, 0)
    );
    accountData$ = this.accountTypeSubject.asObservable();

    public openDialog(data: DialogData) {
        this.accountTypeSubject.next(data);
        this.dialogVisibleSubject.next(true);
    }

    public closeDialog() {
        this.dialogVisibleSubject.next(false);
    }
}

export class DialogData {
    previousAccountType: AccountType;
    currentAccountType: AccountType;
    previousBalance: number;
    currentBalance: number;

    constructor(
        previousAccountType: AccountType,
        currentAccountType: AccountType,
        liveBalance: number,
        demoBalance: number
    ) {
        this.previousAccountType = previousAccountType;
        this.currentAccountType = currentAccountType;
        this.previousBalance = liveBalance;
        this.currentBalance = demoBalance;
    }
}
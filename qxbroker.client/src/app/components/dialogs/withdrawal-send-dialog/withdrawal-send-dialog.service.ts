import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class WithdrawalSendDialogService {
	private dialogVisibleSubject = new BehaviorSubject<boolean>(false);
	dialogVisible$ = this.dialogVisibleSubject.asObservable();

	public async openDialog() {
		this.dialogVisibleSubject.next(true);
	}

	public closeDialog() {
		this.dialogVisibleSubject.next(false);
	}
}
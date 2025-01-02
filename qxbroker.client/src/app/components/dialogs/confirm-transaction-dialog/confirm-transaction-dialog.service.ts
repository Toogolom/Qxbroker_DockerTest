import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class ConfirmTransactionDialogService {
	private dialogVisibleSubject = new BehaviorSubject<boolean>(false);
	dialogVisible$ = this.dialogVisibleSubject.asObservable();

	public transactionId: string = '';

	public async openDialog(transactionId: string) {
		this.transactionId = transactionId;
		this.dialogVisibleSubject.next(true);
	}

	public closeDialog() {
		this.dialogVisibleSubject.next(false);
	}
}
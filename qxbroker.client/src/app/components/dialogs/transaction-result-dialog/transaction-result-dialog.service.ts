import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class TransactionResultDialogService {
	private dialogVisibleSubject = new BehaviorSubject<boolean>(false);
	dialogVisible$ = this.dialogVisibleSubject.asObservable();

	public data: ITransactionResultDialogModel | null = null;


	public async openDialog(data: ITransactionResultDialogModel) {
		this.data = data;
		this.dialogVisibleSubject.next(true);
	}

	public closeDialog() {
		this.dialogVisibleSubject.next(false);
	}
}

export interface ITransactionResultDialogModel {
	type: ResultType;
	message: string;
}

export type ResultType = 'success' | 'error';
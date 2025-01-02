import { BaseModel } from "./base.model";

export interface ITransaction {
	id: string;
	dateAndTime: string;
	type: string;
	status: string;
	paymentSystem: string;
	amount: number;
}

export enum TransactionStatus {
	Waiting = 'Waiting',
	Confirmation = 'Confirmation',
	Success = 'Success',
	Failed = 'Failed',
	Cancel = 'Cancel',
}

export enum PaymentSystem {
    Bitcoin = 'Bitcoin',
    Ethereum = 'Ethereum',
    Litecoin = 'Litecoin',
}

export enum TransactionType {
	Deposit = 'Deposit',
	Withdraw = 'Withdraw',
}

export class TransactionModel extends BaseModel {
	public id: string = '';
	public dateAndTime?: string;
	public type?: TransactionType;
	public status?: TransactionStatus;
	public paymentSystem?: PaymentSystem;
	public amount: number = 0;

	constructor(data: ITransaction) {
		super();
		this.id = data.id;
		this.dateAndTime = data.dateAndTime;
		this.type = TransactionType[data.type as keyof typeof TransactionType];
		this.status = TransactionStatus[data.status as keyof typeof TransactionStatus];
		this.paymentSystem = PaymentSystem[data.paymentSystem as keyof typeof PaymentSystem];
		this.amount = data.amount;
		console.log('asad',this.status);
	}
}
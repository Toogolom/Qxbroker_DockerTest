import { VipStatus } from "../enums/vip-status.enum";
import { BaseModel } from "./base.model";
import { ITransaction, TransactionModel } from "./transaction.model";
import { IVerification, VerificationModel } from "./verification.model";

export class UserModel extends BaseModel {
	public id: string = '';
	public uid: string = '';
	public email: string = '';
	public currency: string = '';
	public totalBalance: number = 0;
	public demoBalance: number = 0;
	public vipStatus: VipStatus = VipStatus.Start;
	public urlProfileImage: string | null = null;
	public transactions: TransactionModel[] = [];
	public verification: VerificationModel | null = null;

	constructor(data: IUserModel) {
		super();
		this.id = data.id;
		this.uid = data.uid;
		this.email = data.email;
		this.currency = data.currency;
		this.totalBalance = data.totalBalance;
		this.demoBalance = data.demoBalance;
		this.vipStatus = data.vipStatus;
		this.urlProfileImage = data.urlProfileImage;
		this.transactions = data.transactions.map(
			(transaction) => new TransactionModel(transaction)
		);
		this.verification = new VerificationModel(data.verification);
	}
}

export interface IUserModel {
	id: string;
	uid: string;
	email: string;
	currency: string;
	totalBalance: number;
	demoBalance: number;
	vipStatus: VipStatus;
	urlProfileImage: string | null;
	transactions: ITransaction[];
	verification: IVerification;
}
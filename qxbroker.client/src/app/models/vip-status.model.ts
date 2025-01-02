import { VipStatus } from "../enums/vip-status.enum";
import { BaseModel } from "./base.model";

export class VipStatusModel extends BaseModel {
	public key: VipStatus = VipStatus.None;
	public importance: number = 0;
	public name: string = "";
	public depositBalanceFrom: number = 0;
	public depositBalanceTo: number = 0;
	public advantages: Array<IAdvantage> = new Array<IAdvantage>()

	constructor(data: IVipStatusModel) {
		super();
		if (data) {
			this.mapFromJson(data);
		}
	}
}

export interface IVipStatusModel {
	key: VipStatus;
	importance: number;
	name: string;
	depositBalanceFrom: number;
	depositBalanceTo: number;
	advantages: Array<IAdvantage>;
}

export interface IAdvantage {
	label: string;
	description: string;
}
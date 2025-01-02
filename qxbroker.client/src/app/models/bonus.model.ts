import { BaseModel } from "./base.model";

export class BonusModel extends BaseModel {
	public code: string = '';
	public name: string = '';
	public percent: number = 0;
	public minAmount: number = 0;

	constructor(data: IBonusModel) {
		super();
		if (data) {
			this.mapFromJson(data);
		}
	}
}

export interface IBonusModel {
	code: string;
	name: string;
	percent: number;
	minAmount: number;
	classes: string;
}
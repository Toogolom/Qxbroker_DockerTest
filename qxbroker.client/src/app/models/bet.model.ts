import { BaseModel } from "./base.model";

export class BetModel extends BaseModel {
    public id: string = '';
    public amount: number = 0;
    public betType?: BetType;
    public status?: BetStatus;
    public pair?: string = '';
    public percent: number = 0;
    public openTime?: Date;
    public closeTime?: Date;
    public openPrice: number = 0;
    public closePrice: number = 0;
    public income: number = 0;
    public duration: number = 0;
    public isDetailsVisible: boolean = false;

    constructor(data: any = null) {
        super();
        if (data) {
            this.mapFromJson(data);
        }
    }
}

export interface IBetModel {
    id: string;
    amount: number;
    betType: BetType;
    status: BetStatus;
    pair: string;
    percent: number;
    openTime: Date;
    closeTime: Date;
    openPrice: number;
    closePrice: number;
    income: number;
    duration: string;
}

export enum BetType {
	Up = 'Up',
	Down = 'Down',
}

export enum BetStatus {
	Failed = 'Failed',
	Success = 'Success',
    InProceed = 'InProceed',
}

import { BetType } from "../bet.model";

export class CreateBetRequest {
    public amount: number = 0;
    public betType?: BetType;
    public pair?: string = '';
    public time: number = 0;
    public isDemo = false;
}

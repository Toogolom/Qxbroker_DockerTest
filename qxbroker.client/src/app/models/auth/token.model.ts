import { BaseModel } from "../base.model";

export class TokenModel extends BaseModel {
    public accessToken!: string;
    public refreshToken!: string;

    constructor(data?: ITokenModel | null) {
        super();
        if (data) {
            this.mapFromJson(data);
        }
    }
}

export interface ITokenModel {
    accessToken: string;
    refreshToken: string;
}

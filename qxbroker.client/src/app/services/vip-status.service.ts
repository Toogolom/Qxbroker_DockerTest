import { inject, Injectable } from "@angular/core";
import { ApiClient } from "./api/api.client";
import { VipStatusModel } from "../models/vip-status.model";

@Injectable({
	providedIn: "root"
})
export class VipStatusService {
	private readonly api = inject(ApiClient);

	public async getStatuses(): Promise<Array<VipStatusModel> | null> {
		return await this.api.get<Array<VipStatusModel>>('VipStatus/GetAll');
	}
}
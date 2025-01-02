import { inject, Injectable } from "@angular/core";
import { ApiClient } from "./api/api.client";
import { IBonusModel } from "../models/bonus.model";

@Injectable({
	providedIn: "root"
})
export class ConfigService {
	private readonly apiClient = inject(ApiClient);

	public getWalletAddress(currency: string): Promise<IWallet | null> {
		return this.apiClient.get<IWallet>(`Config/wallet-address/${currency}`);
	}

	public getBonuses(): Promise<IBonusModel[] | null> {
		return this.apiClient.get<IBonusModel[]>(`Config/all-bonuses`);
	}

	public getFirstDepositBonus(): Promise<IBonusModel | null> {
		return this.apiClient.get<IBonusModel>(`Config/first-dep-bonus`);
	}
}

export interface IWallet {
	currency: string;
	walletAddress: string;
	qrCode: string;
}
import { inject, Injectable } from "@angular/core";
import { ApiClient } from "./api/api.client";
import { BehaviorSubject } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { IUserModel, UserModel } from "../models/user.model";
import { UpdateDemoBalanceRequest } from "../models/requests/update-demo-balance-request.model";
import { AppState } from "./app-state.service";
import { TransactionType } from "../components/deposit/deposit-info";
import { ITransaction, PaymentSystem } from "../models/transaction.model";

@Injectable({
    providedIn: "root"
})
export class UserService {
    private readonly apiClient = inject(ApiClient);
    private readonly cookieService = inject(CookieService);
    private readonly appState = inject(AppState);

    private userSubject = new BehaviorSubject<UserModel | null>(this.loadUserFromCookies());
    public user$ = this.userSubject.asObservable();

    constructor() {
        this.getUser();
    }

    public get userData(): UserModel | null {
        return this.userSubject.getValue();
    }

    public set userData(user: IUserModel | null) {
        if (!user) {
            return;
        }

        this.userSubject.next(new UserModel(user));
        this.saveUserToCookies(user);
    }

    public async getUser(): Promise<UserModel | null> {
        const user = await this.apiClient.get<IUserModel>("User");

        if (!user) {
            return null;
        }

        this.userData = user;
        return new UserModel(user);
    }

    public async updateDemoBalance(request: UpdateDemoBalanceRequest) {
        return this.apiClient.post("User/updateDemoBalance", request);
    }

    public async updateUserPhoto(file: File): Promise<UserModel> {
        const formData = new FormData();
        formData.append("file", file);

        return this.apiClient.post("User/upload-profile-picture", formData);
    }

    public async deleteUserPhoto(): Promise<void> {
        return this.apiClient.delete("User/delete-profile-picture");
    }

    public async getTransactionById(id: string): Promise<ITransaction | null> {
        return this.apiClient.get<ITransaction>(`User/transaction/${id}`)
    }

    public async sendVerification(model: {
        name: string;
        surname: string;
        walletAddress: string;
        mobileNumber: string;
        file: File;
    }): Promise<void> {
        const formData = new FormData();
    
        formData.append('Name', model.name);
        formData.append('Surname', model.surname);
        formData.append('WalletAddress', model.walletAddress);
        formData.append('MobileNumber', model.mobileNumber);
        formData.append('File', model.file);
    
        await this.apiClient.post('User/Verification', formData);
    }

    public async addConfirmTransactionImage(file: File, transactionId: string): Promise<void> {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id", transactionId);
    
        return this.apiClient.post("User/add-confirm-transaction-image", formData);
    }

    public async addTransaction(request: ITransactionRequestModel): Promise<{ id: string}> {
        return this.apiClient.post("User/AddTransaction", request);
    }

    private loadUserFromCookies(): UserModel | null {
        const userData = this.cookieService.get("user");
        return userData ? JSON.parse(userData) : null;
    }

    private saveUserToCookies(user: IUserModel | null): void {
        if (user) {
            this.cookieService.set("user", JSON.stringify(user), { expires: 7, path: '/' });
            this.appState.currency$.next(user.currency);
        } else {
            this.cookieService.delete("user");
        }
    }
}

export interface ITransactionRequestModel {
    type: TransactionType;
    paymentSystem: PaymentSystem;
    amount: number;
}
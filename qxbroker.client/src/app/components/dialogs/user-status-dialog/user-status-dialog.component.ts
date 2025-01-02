import { Component, inject, OnInit } from '@angular/core';
import { UserStatusDialogService } from './user-status-dialog.service';
import { UserService } from '../../../services/user.service';
import { VipStatus } from '../../../enums/vip-status.enum';
import { VipStatusService } from '../../../services/vip-status.service';
import { VipStatusModel } from '../../../models/vip-status.model';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
	selector: 'app-user-status-dialog',
	templateUrl: './user-status-dialog.component.html',
	styleUrl: './user-status-dialog.component.scss'
})
export class UserStatusDialogComponent implements OnInit {
	public readonly dialogService = inject(UserStatusDialogService);
	public readonly userService = inject(UserService);
	private readonly router = inject(Router);
	private readonly vipStatusService = inject(VipStatusService);

	public user$ = this.userService.user$;
	public VipStatus = VipStatus;

	public vipStatuses: VipStatusModel[] = [];

	public async ngOnInit(): Promise<void> {
		this.vipStatuses =  await this.vipStatusService.getStatuses() ?? [];
	}

	public formattedUserPhotoURL(url: string): string {
		return environment.apiBaseUrl + url;
	}

	public isHigherPriority(value: VipStatusModel, userStatus?: VipStatus): boolean {
		const currentUserStatus = this.getStatusByKey(userStatus);
		// @ts-ignore
		if (!currentUserStatus) {
			return true;
		}

		return value.importance > currentUserStatus.importance;
	}

	private getStatusByKey(key?: VipStatus): VipStatusModel | null {
		if (!key) {
			return null;
		}

		return this.vipStatuses.find(status => status.key === key) ?? null;
	}

	public closeDialog(): void {
		this.dialogService.closeDialog();
	}

	public goToDeposit() {
		this.dialogService.closeDialog();
		this.router.navigate(['/deposit']);
	}
}

// export interface VipStatusData {
// 	key: VipStatus,
// 	name: string,
// 	depositBalanceFrom: number,
// 	depositBalanceTo: number,
// 	border: BorderData[] | null,
// 	advantages: AdvantageData[]
// }

// export interface BorderData {
// 	border: string,
// 	classes: string
// }

// export interface AdvantageData {
// 	label: string,
// 	value: string
// }

// public vipStatuses: VipStatusData[] = [
// 	{
// 		key: VipStatus.Start,
// 		name: 'Start',
// 		depositBalanceFrom: 10,
// 		depositBalanceTo: 99.99,
// 		border: null,
// 		advantages: [
// 			{ label: '25', value: 'Trading assets' },
// 			{ label: '100$', value: 'Withdrawal limit per day' },
// 			{ label: '1,000$', value: 'Withdrawal limit per month' },
// 			{ label: '1', value: 'Requests for withdrawal of funds per day' },
// 			{ label: '100$', value: 'The amount of open transactions at a time' }
// 		]
// 	},
// 	{
// 		key: VipStatus.Standart,
// 		name: 'Standart',
// 		depositBalanceFrom: 100,
// 		depositBalanceTo: 499.99,
// 		border: [
// 			{
// 				border: '/assets/images/user-statuses/Standart.png',
// 				classes: ''
// 			}
// 		],
// 		advantages: [
// 			{ label: '33', value: 'Trading assets' },
// 			{ label: '500$', value: 'Withdrawal limit per day' },
// 			{ label: '2,500$', value: 'Withdrawal limit per month' },
// 			{ label: '5', value: 'Requests for withdrawal of funds per day' },
// 			{ label: '250$', value: 'The amount of open transactions at a time' }
// 		]
// 	},
// 	{
// 		key: VipStatus.Premium,
// 		name: 'Premium',
// 		depositBalanceFrom: 500,
// 		depositBalanceTo: 2499.99,
// 		border: [ 
// 			{
// 				border:'/assets/images/user-statuses/Premium.png',
// 				classes: ''
// 			}
// 		],
// 		advantages: [
// 			{ label: '40', value: 'Trading assets' },
// 			{ label: '2,500$', value: 'Withdrawal limit per day' },
// 			{ label: '10,000$', value: 'Withdrawal limit per month' },
// 			{ label: '20', value: 'Requests for withdrawal of funds per day' },
// 			{ label: '1,000$', value: 'The amount of open transactions at a time' }
// 		]
// 	},
// 	{
// 		key: VipStatus.Vip,
// 		name: 'VIP',
// 		depositBalanceFrom: 2500,
// 		depositBalanceTo: 5000,
// 		border: [
// 			{
// 				border: '/assets/images/user-statuses/Vip.png',
// 				classes: ''
// 			}, 
// 			{
// 				border: '/assets/images/user-statuses/Crown(vip).png',
// 				classes: 'crown'
// 			}
// 		],
// 		advantages: [
// 			{ label: '57', value: 'Trading assets' },
// 			{ label: '10,000$', value: 'Withdrawal limit per day' },
// 			{ label: '100,000$', value: 'Withdrawal limit per month' },
// 			{ label: 'NO LIMIT', value: 'Requests for withdrawal of funds per day' },
// 			{ label: 'NO LIMIT', value: 'The amount of open transactions at a time' }
// 		]
// 	}
//   ];
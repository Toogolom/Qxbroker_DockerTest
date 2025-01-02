import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-user-settings',
	templateUrl: './user-settings.component.html',
	styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent {
	private readonly userService = inject(UserService);

	public user$ = this.userService.user$;
	public selectedFile: File | null = null;

	public formattedUserPhotoURL(url: string): string {
		return environment.apiBaseUrl + url;
	}

	public async onFileSelected(event: Event): Promise<void> {
		const input = event.target as HTMLInputElement;
		if (input?.files?.length) {
			this.selectedFile = input.files[0];
			console.log('File selected:', this.selectedFile);
			const url = await this.uploadProfilePicture();
			this.userService.userData!.urlProfileImage = url;
		}
	}

	private async uploadProfilePicture(): Promise<string | null> {
		try {
			if (!this.selectedFile) {
				return null;
			} 

			return (await this.userService.updateUserPhoto(this.selectedFile)).urlProfileImage;
		}
		catch (error) {
			console.error(error);
			return null;
		}
	}

	public async deleteUserPhoto(): Promise<void> {
		try {
			return await this.userService.deleteUserPhoto().then(() => {
				this.selectedFile = null;
				this.userService.userData!.urlProfileImage = null;
			});
		}
		catch (error) {
			console.error(error);
		}
	}
}

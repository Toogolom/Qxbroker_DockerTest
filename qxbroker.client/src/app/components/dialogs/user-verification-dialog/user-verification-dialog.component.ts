import { Component, inject } from '@angular/core';
import { UserVerificationDialogService } from './user-verification-dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
	selector: 'app-user-verification-dialog',
	templateUrl: './user-verification-dialog.component.html',
	styleUrl: './user-verification-dialog.component.scss'
})
export class UserVerificationDialogComponent {
	public dialogService = inject(UserVerificationDialogService);
	private readonly formBuilder = inject(FormBuilder);
	private readonly userService = inject(UserService);

	public isDragging = false;
	public selectedPhoto: File | null = null;
	public photoPreview: string | null = null;

	public verificationForm: FormGroup;
	public submitted = false;
	private selectedFile!: File;

	constructor() {
		this.verificationForm = this.formBuilder.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			phone: [
				'',
				[
					Validators.required,
					this.phoneValidator
					// Validators.pattern(/^(\+?)[0-9]{10,15}$/) // Adjust for any-country phone validation
				]
			],
			trc20: [
				'',
				[
					Validators.required,
					Validators.pattern(/^T[a-zA-Z0-9]{33}$/) // Basic TRC20 regex pattern
				]
			]
		});
	}

	public get formControls() {
		return this.verificationForm.controls;
	}
	
	public async onSubmit(): Promise<void> {
		this.submitted = true;
		console.log('a');
		
	
		if (this.verificationForm.valid) {
			console.log('b');

			const model: IVerificationModel = {
				name: this.verificationForm.get('firmsName')?.value,
				surname: this.verificationForm.get('lastName')?.value,
				walletAddress: this.verificationForm.get('trc20')?.value,
				mobileNumber: this.verificationForm.get('phone')?.value,
				file: this.selectedFile
			};
		
			try {
				await this.userService.sendVerification(model)
					.then(() => {
						this.dialogService.closeDialog();
						this.userService.getUser();
					});
			} catch (error) {
				console.error('Failed to send verification data:', error);
			}
		}
	}

	public phoneValidator(control: any): { [key: string]: boolean } | null {
		const value = control.value?.toString().trim(); // Ensure input is trimmed
		const phoneRegex = /^\+?\d{7,15}$/;
		const a = phoneRegex.test(value);
		console.log('value', value);
		
		if (value && !phoneRegex.test(value)) {
			console.log('Invalid phone number');
			
		  return { invalidPhone: true }; // Invalid if it doesn't match the regex
		}
		return null;
	}

	// При перетаскивании файла на элемент
	public onDragOver(event: DragEvent): void {
		event.preventDefault();
		this.isDragging = true;
	}
	
	// Когда файл покидает зону
	public onDragLeave(event: DragEvent): void {
		event.preventDefault();
		this.isDragging = false;
	}
	
	// При отпускании файла в зоне
	public onDrop(event: DragEvent): void {
		event.preventDefault();
		this.isDragging = false;
	
		if (event.dataTransfer?.files.length) {
			const file = event.dataTransfer.files[0];
			this.handleFile(file);
		}
	}
	
	// Когда файл выбран через input
	public onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files?.length) {
			this.selectedFile = input.files[0];
			this.handleFile(this.selectedFile);
		}
	}
	
	// Общая обработка файла
	private handleFile(file: File): void {
		if (file.type.startsWith('image/')) {
			this.selectedPhoto = file;
		
			// Для превью изображения
			const reader = new FileReader();
			reader.onload = () => {
				this.photoPreview = reader.result as string;
			};
			reader.readAsDataURL(file);
		} else {
			alert('Please, select image.');
		}
	}
	
	public closeDialog(): void {
		this.dialogService.closeDialog();
	}
}

export interface IVerificationModel {
	name: string;
	surname: string;
	walletAddress: string;
	mobileNumber: string;
	file: File;
}
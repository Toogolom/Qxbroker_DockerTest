import { Component, inject } from '@angular/core';
import { ConfirmTransactionDialogService } from './confirm-transaction-dialog.service';
import { UserService } from '../../../services/user.service';
import { TransactionResultDialogService } from '../transaction-result-dialog/transaction-result-dialog.service';

@Component({
	selector: 'app-confirm-transaction-dialog',
	templateUrl: './confirm-transaction-dialog.component.html',
	styleUrl: './confirm-transaction-dialog.component.scss'
})
export class ConfirmTransactionDialogComponent {
	public readonly dialogService = inject(ConfirmTransactionDialogService);
	private readonly transactionResultDialogService = inject(TransactionResultDialogService);
	private readonly userService = inject(UserService);

	public isDragging = false;
	public selectedPhoto: File | null = null;
	public photoPreview: string | null = null;

	public async sendTransactionImage(): Promise<void> {
		if (!this.selectedPhoto) {
			alert("Please select an image first.");
			return;
		}

		try {
			console.log('this.selectedPhoto', this.selectedPhoto);
			console.log('this.dialogService.transactionId', this.dialogService.transactionId);
			
			await this.userService.addConfirmTransactionImage(this.selectedPhoto, this.dialogService.transactionId)
				.then(() => {
					this.closeDialog();
					this.transactionResultDialogService.openDialog({
						type: 'success',
						message: 'Your application is currently being processed'
					});
				})
				.catch(error => {
					this.transactionResultDialogService.openDialog({
						type: 'error',
						message: 'Something went wrong. Please try again later.'
					});
				})
		} catch (error) {
			alert("Failed to upload the photo. Please try again.");
		}
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
			const file = input.files[0];
			this.handleFile(file);
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

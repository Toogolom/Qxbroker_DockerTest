import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { SendConfirmEmailRequest } from '../../models/requests/send-confirm-email-request.model';
import { Router } from '@angular/router';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
	private readonly authService = inject(AuthService);
	private readonly router = inject(Router);

	public readonly formGroup: FormGroup;
	public currency = [
		{id: 1, name: 'USD'},
		{id: 2, name: 'RUB'}
	];
	public countryItems = [
		{id: 1, name: 'Moscow'},
		{id: 2, name: 'USA'}
	];
	public errorSignUpMessage = '';
	public showPassword: boolean = false;

	constructor() {
		this.formGroup = new FormGroup({
			country: new FormControl<string>('', [Validators.required]),
			currency: new FormControl<any>('USD', [Validators.required]),
			email: new FormControl<string>('', [Validators.required, Validators.email]),
			password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
			over18: new FormControl<boolean>(false, [Validators.requiredTrue]),
			notUSResident: new FormControl<boolean>(false, [Validators.requiredTrue])
		});
	}

	public get country(): AbstractControl | null { return this.formGroup.get('country'); }
	public get currencyControl(): AbstractControl | null { return this.formGroup.get('currency'); }
	public get email(): AbstractControl | null { return this.formGroup.get('email'); }
	public get password(): AbstractControl | null { return this.formGroup.get('password'); }
	public get over18(): AbstractControl | null { return this.formGroup.get('over18'); }
	public get notUSResident(): AbstractControl | null { return this.formGroup.get('notUSResident'); }

	public async onSubmit() {
		this.formGroup.markAllAsTouched();

		const form = document.querySelector('form');
		if (!form?.checkValidity()) {
			form!.reportValidity();
			return;
		}

		if (this.formGroup.invalid) {
			return;
		}

		const sendConfirmEmailRequest: SendConfirmEmailRequest = {
			email: this.email?.value,
			password: this.password?.value,
			country: this.country?.value,
			currency: this.currencyControl?.value
		};

		try {
			await this.authService.sendConfirmEmail(sendConfirmEmailRequest);
		}
		catch (error: any) {
			if (error.status === 409) {
				this.errorSignUpMessage = 'Conflict: Email already in use or other issue.';
			} else {
				this.errorSignUpMessage = 'An error occurred. Please try again later.';
			}
		}

		this.router.navigate(['/confirm-email'], {queryParams: {status: 'pending'}});
	}
}


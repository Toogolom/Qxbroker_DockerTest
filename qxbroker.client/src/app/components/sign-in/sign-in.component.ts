import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '../../models/requests/login-request.model';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
	private readonly authService = inject(AuthService);
	private readonly userService = inject(UserService);
	private readonly router = inject(Router);

	public readonly formGroup: FormGroup;
	public loginError: boolean = false;
	public showPassword: boolean = false;

	constructor() {
		this.formGroup = new FormGroup({
			email: new FormControl<string>('', [Validators.required, Validators.email]),
			password: new FormControl<string>('', [Validators.required])
		});
	}

	public get email(): AbstractControl | null { return this.formGroup.get('email'); }
	public get password(): AbstractControl | null { return this.formGroup.get('password'); }

	public async login() {
		this.formGroup.markAllAsTouched();

		const form = document.querySelector('form');
		if (!form?.checkValidity()) {
			form!.reportValidity();
			return;
		}

		if (this.formGroup.invalid) {
			return;
		}

		const loginRequest: LoginRequest = {
			email: this.email?.value,
			password: this.password?.value,
		};

		try {
			await this.authService.login(loginRequest)
				.then(async (data) => {
					if (data) {
						await this.userService.getUser();
					}
				});

			this.router.navigate(['/trade']);
		}
		catch (error: any) {
			this.loginError = true;
		}
	}

}

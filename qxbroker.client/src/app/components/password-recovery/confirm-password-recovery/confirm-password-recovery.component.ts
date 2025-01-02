import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

@Component({
    selector: 'app-confirm-password-recovery',
    templateUrl: './confirm-password-recovery.component.html',
    styleUrl: './confirm-password-recovery.component.scss'
})
export class ConfirmPasswordRecoveryComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly authService = inject(AuthService);

    public currentStep: number = 1;
    public email: string = '';
    public formSubmitted: boolean = false;
    public recoverPasswordForm: FormGroup = new FormGroup({
        oldPassword: new FormControl<string>('', [Validators.required, Validators.minLength(6) ]),
        newPassword: new FormControl<string>('', [Validators.required]),
    }, { updateOn: 'submit'});

    private token: string = '';

    public async ngOnInit(): Promise<void> {
        this.recoverPasswordForm.setValidators(passwordMatchValidator('oldPassword', 'newPassword'));

        this.activatedRoute.queryParams
            .subscribe(params => {
                this.token = params['token'] || null;
                if (!this.token) {
                    this.router.navigate(['/password-recovery']);
                    return;
                }

                this.checkTokenValidity(this.token);
            });
    }

    private checkTokenValidity(token: string): void {
        try {
            const decodedToken: any = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000); // Время в секундах

            if (decodedToken.exp && decodedToken.exp > currentTime) {
                // this.authService.accessToken = token;
                this.email = decodedToken['sub'];
            } else {
                this.router.navigate(['/password-recovery']);
                return;
            }
        } catch (error) {
            this.router.navigate(['/password-recovery']);
        }
    }

    public get f() {
        return this.recoverPasswordForm.controls;
    }

    public async changePassword(): Promise<void> {
        this.formSubmitted = true;

        if (this.recoverPasswordForm.invalid) {
            return;
        }

        try {
            await this.authService.recoverPassword(this.token, this.recoverPasswordForm.get('newPassword')?.value);
        }
        catch {
            console.log('Error');
        }

        this.currentStep++;
    }

    public goToSignIn(): void {
        this.router.navigate(['/sign-in']);
    }
}

export function passwordMatchValidator(oldPassword: string, newPassword: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const oldPasswordControl = formGroup.get(oldPassword);
        const newPasswordControl = formGroup.get(newPassword);

        if (!oldPasswordControl || !newPasswordControl) return null;

        const oldPasswordValue = oldPasswordControl.value;
        const newPasswordValue = newPasswordControl.value;

        return oldPasswordValue === newPasswordValue ? null : { passwordMismatch: true };
    };
}

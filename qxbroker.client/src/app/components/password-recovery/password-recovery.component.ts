import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { SendRecoveryPasswordRequest } from '../../models/requests/send-recovery-password-request.model';

@Component({
    selector: 'app-password-recovery',
    templateUrl: './password-recovery.component.html',
    styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent {
    private readonly authService = inject(AuthService);

    public currentStep: number = 1;

    public confirmEmailForm: FormGroup = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email])
    });

    public get email() {
        return this.confirmEmailForm.get('email')?.value;
    }

    public sendEmail() {
        this.confirmEmail();
        this.recoverPassword();
    }

    private confirmEmail() {
        if (this.confirmEmailForm.invalid) {
            return;
        }

        this.currentStep++;
    }

    private async recoverPassword(): Promise<void> {
        return await this.authService.recoverPasswordRequest({ email: this.email} as SendRecoveryPasswordRequest);
    }
}
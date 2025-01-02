import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-confirm-email',
    templateUrl: './confirm-email.component.html',
    styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);
    private readonly userService = inject(UserService);

    public confirmationMessage: string = '';
    public email: string = '';

    public ngOnInit(): void {
        this.route.queryParams.subscribe(async params => {
            const token = params['token'] || null;
            const status = params['status'] || null;

            console.log('token21321321', token);
            console.log('status432432432', status);

            if (status === 'pending') {
                this.confirmationMessage = 'A confirmation link has been sent to your email'
            }
            else if (token) {
                try {
                    this.authService.accessToken = token;
                    await this.authService.confirmEmail()
                        .then(() => this.userService.getUser());
                    this.router.navigate(['/trade']);
                } catch (error: any) {
                    if (error.status === 409) {
                        this.confirmationMessage = 'Invalid token';
                    } else {
                        this.confirmationMessage = 'An error occurred. Please try again later.';
                    }
                }
            } else {
                this.confirmationMessage = 'Email confirmation error'
            }
        })
    }
}

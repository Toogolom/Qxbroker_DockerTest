import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    private readonly router = inject(Router);

    public opened = false;

    public openDropdown(): void {
        this.opened = !this.opened;
    }

    public navigateTo(route: string): void {
        this.router.navigate([route]);
        this.opened = false;
    }
}

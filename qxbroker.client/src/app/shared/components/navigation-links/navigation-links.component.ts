import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { filter } from 'rxjs';

@Component({
    selector: 'app-navigation-links',
    templateUrl: './navigation-links.component.html',
    styleUrl: './navigation-links.component.scss'
})
export class NavigationLinksComponent {
    private readonly router = inject(Router);
    private readonly activatedRoute = inject(ActivatedRoute);

    public title: string = '';
    public dropdownOpened: boolean = false;

    public routes: IRoute[] = [
        { path: '/deposit', title: 'Deposit' },
        { path: '/withdrawal', title: 'Withdrawal' },
        { path: '/transactions', title: 'Transactions'},
        { path: '/trades', title: 'Trades' },
        { path: '/settings', title: 'Account' },
        { path: '/analytics', title: 'Analytics' },
    ];

    public ngOnInit(): void {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd || event instanceof Scroll)
        ).subscribe(event => {
            let navigationEndEvent: NavigationEnd | null = null;

            if (event instanceof NavigationEnd) {
                navigationEndEvent = event;
            } else if (event instanceof Scroll && event.routerEvent instanceof NavigationEnd) {
                navigationEndEvent = event.routerEvent;
            }

            if (navigationEndEvent) {
                const route = this.getChild(this.activatedRoute);
                route.data.subscribe(data => {
                    this.title = this.routes.find(rt => rt.title === data['title'])?.title || '';
                });
            }
        });
    }

    private getChild(activatedRoute: ActivatedRoute) {
        while (activatedRoute.firstChild) {
            activatedRoute = activatedRoute.firstChild;
            console.log(activatedRoute);
        }
        return activatedRoute;
    }

    public isActive(route: string): boolean {
        return this.router.url.includes(route);
    }

    public toggleDropdown(): void {
        this.dropdownOpened = !this.dropdownOpened;
    }
}

export interface IRoute {
    path: string;
    title: string;
}
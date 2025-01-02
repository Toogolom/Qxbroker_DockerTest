import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { BalanceValuesComponent } from './components/balance-values/balance-values.component';
import { CommonModule } from '@angular/common';
import { NavigationLinksComponent } from './components/navigation-links/navigation-links.component';
import { BrandsFooterComponent } from './components/brands-footer/brands-footer.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
    declarations: [
        BalanceValuesComponent,
        NavigationLinksComponent,
        BrandsFooterComponent
    ],
    imports: [
        MatDatepickerModule,
        MatNativeDateModule,
        CommonModule,
        AppRoutingModule
    ],
    providers: [provideNativeDateAdapter()],
    exports: [
        MatDatepickerModule,
        BalanceValuesComponent,
        NavigationLinksComponent,
        BrandsFooterComponent
    ]
})
export class SharedModule { }
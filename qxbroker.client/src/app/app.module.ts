import { HttpClient, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ApiClient } from './services/api/api.client';
import { TradeChartComponent } from './components/trade-chart/trade-chart.component';
import { FaqComponent } from './components/faq/faq.component';
import { FooterComponent } from './components/footer/footer.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { authTokenInterceptor } from './services/auth/auth.interceptor';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TradePageComponent } from './components/trade-page/trade-page.component';
import { TradeSidebarComponent } from './components/trade-sidebar/trade-sidebar.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountTypeChangedDialogComponent } from './components/dialogs/account-type-changed-dialog/account-type-changed-dialog.component';
import { DepositComponent } from './components/deposit/deposit.component';
import { WithdrawalComponent } from './components/withdrawal/withdrawal.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { ConfirmPasswordRecoveryComponent } from './components/password-recovery/confirm-password-recovery/confirm-password-recovery.component';
import { TradesComponent } from './components/trades/trades.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { SharedModule } from './shared/shared.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DateInputFilterDirective } from './directives/date-filter.directive';
import { TradeChartDropdownComponent } from './components/trade-chart/dropdown/dropdown.component';
import { NgxMaskDirective, provideEnvironmentNgxMask } from 'ngx-mask';
import { DealFormComponent } from './components/trade-sidebar/deal-form/deal-form.component';
import { AlertComponent } from './components/shared/alerts/alerts.component';
import { CloseBtnWithTimerComponent } from './components/shared/alerts/close-btn-with-timer/close-btn-with-timer.component';
import { UserStatusDialogComponent } from './components/dialogs/user-status-dialog/user-status-dialog.component';
import { PaymentComponent } from './components/deposit/payment/payment.component';
import { TransactionComponent } from './components/deposit/transaction/transaction.component';
import { ConfirmTransactionDialogComponent } from './components/dialogs/confirm-transaction-dialog/confirm-transaction-dialog.component';
import { UserVerificationDialogComponent } from './components/dialogs/user-verification-dialog/user-verification-dialog.component';
import { TradesAlertComponent } from './components/shared/alerts/trades-alert/trades-alert.component';
import { TransactionResultDialogComponent } from './components/dialogs/transaction-result-dialog/transaction-result-dialog.component';
import { WithdrawalSendDialogComponent } from './components/dialogs/withdrawal-send-dialog/withdrawal-send-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        MainComponent,
        SignInComponent,
        SignUpComponent,
        FaqComponent,
        ContactsComponent,
        UserSettingsComponent,
        TradeChartComponent,
        ConfirmEmailComponent,
        PageHeaderComponent,
        SidebarComponent,
        TradePageComponent,
        TradeSidebarComponent,
        ClickOutsideDirective,
        AccountTypeChangedDialogComponent,
        DepositComponent,
        WithdrawalComponent,
        PasswordRecoveryComponent,
        ConfirmPasswordRecoveryComponent,
        TradesComponent,
        TransactionsComponent,
        DateInputFilterDirective,
        TradeChartDropdownComponent,
        DealFormComponent,
        AlertComponent,
        CloseBtnWithTimerComponent,
        UserStatusDialogComponent,
        PaymentComponent,
        TransactionComponent,
        ConfirmTransactionDialogComponent,
        UserVerificationDialogComponent,
        TradesAlertComponent,
        TransactionResultDialogComponent,
        WithdrawalSendDialogComponent,
    ],
    imports: [
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgSelectModule,
        FormsModule,
        BrowserAnimationsModule,
        SharedModule,
        NgxMaskDirective
    ],
    providers: [
        ApiClient,
        provideHttpClient(
            withInterceptors([authTokenInterceptor]),
        ),
        provideAnimationsAsync(),
        provideEnvironmentNgxMask()
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

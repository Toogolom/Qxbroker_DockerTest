import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { MainComponent } from './components/main/main.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { FaqComponent } from './components/faq/faq.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { canActivateAuth, canActivateGuest } from './services/auth/access.guard';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { TradePageComponent } from './components/trade-page/trade-page.component';
import { DepositComponent } from './components/deposit/deposit.component';
import { WithdrawalComponent } from './components/withdrawal/withdrawal.component';
import { ConfirmPasswordRecoveryComponent } from './components/password-recovery/confirm-password-recovery/confirm-password-recovery.component';
import { TradesComponent } from './components/trades/trades.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { PaymentComponent } from './components/deposit/payment/payment.component';
import { TransactionComponent } from './components/deposit/transaction/transaction.component';

const routes: Routes = [
    {path: '', component: MainComponent, canActivate: [canActivateGuest]},
    {path: 'sign-in', component: SignInComponent, canActivate: [canActivateGuest]},
    {path: 'sign-up', component: SignUpComponent, canActivate: [canActivateGuest]},
    {path: 'education', loadChildren: () => import('./components/learning/learning.module').then(m => m.LearningModule)},
    {path: 'password-recovery', component: PasswordRecoveryComponent, canActivate: [canActivateGuest]},
    {path: 'recovery-password-confirm', component: ConfirmPasswordRecoveryComponent, canActivate: [canActivateGuest]},
    {path: 'about-us', component: AboutUsComponent, canActivate: [canActivateGuest]},
    {path: 'faq', component: FaqComponent },
    {path: 'settings', component: UserSettingsComponent, canActivate: [canActivateAuth], data: { title: 'Account'}},
    {path: 'trade', component: TradePageComponent, canActivate: [canActivateAuth]},
    {path: 'confirm-email', component: ConfirmEmailComponent, canActivate: [canActivateGuest]},
    {path: 'deposit', component: DepositComponent, canActivate: [canActivateAuth], data: {title: 'Deposit'}},
    {path: 'deposit/:type', component: PaymentComponent, canActivate: [canActivateAuth], data: {title: 'Deposit'}},
    {path: 'deposit/confirm/:transactionId', component: TransactionComponent, canActivate: [canActivateAuth], data: {title: 'Deposit'}},
    {path: 'withdrawal', component: WithdrawalComponent, canActivate: [canActivateAuth], data: {title: 'Withdrawal'}},
    {path: 'transactions', component: TransactionsComponent, canActivate: [canActivateAuth], data: {title: 'Transactions'}},
    {path: 'trades', component: TradesComponent, canActivate: [canActivateAuth], data: {title: 'Trades'}}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

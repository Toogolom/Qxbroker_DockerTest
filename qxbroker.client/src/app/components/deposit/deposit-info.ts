import { PaymentSystem } from "../../models/transaction.model";

export interface IDepositVariant {
    paymentSystem: PaymentSystem;
    name: string;
    code: string;
    icons: string[];
}

export enum TransactionType {
    Deposit = 0,
    Withdraw = 1
}

export const depositVariants : IDepositVariant[] = [
	{
		paymentSystem: PaymentSystem.Bitcoin,
		name: 'Bitcoin',
		code: 'BTC',
		icons: ['/assets/images/deposit/payments-icons/crypto-btc.svg']
	},
	{
		paymentSystem: PaymentSystem.Ethereum,
		name: 'Etherium',
		code: 'ETH',
		icons: ['/assets/images/deposit/payments-icons/crypto-eth.svg']
	},
	{
		paymentSystem: PaymentSystem.Litecoin,
		name: 'Litecoin',
		code: 'LTC',
		icons: ['/assets/images/deposit/payments-icons/crypto-ltc.svg']
	},
]


export const faq: IFaq[] = [
	{
		question: "Is there a minimum amount that I can deposit to my account at registration?",
		answer: `<p>The advantage of the Company’s trading platform is that you don’t have to deposit large amounts to your account. You can start trading by investing a small amount of money. The minimum deposit is 10 US dollars.</p>`,
		toggled: false
	},
	{
		question: "Do I need to deposit the account of the trading platform and how often do I need to do this?",
		answer: `<p>To work with binary options you need to open an individual account. To conclude real trades, you will certainly need to make a deposit in the amount of options purchased.</p>
				 <p>You can start trading without cash, only using the company's training account (demo account). Such an account is free of charge and created to demonstrate the functioning of the trading platform. With the help of such an account, you can practice acquiring binary options, understand the basic principles of trading, test various methods and strategies, or evaluate the level of your intuition.</p>
				`,
		toggled: false
	},
	{
		question: "How can I deposit?",
		answer: `<p>It is very easy to do. The procedure will take a couple of minutes.</p>
				 <p>1) Open the trade execution window and click on the green "Deposit" button in the upper right corner of the tab.</p>
				 <p>You can also deposit the account through your Personal Account by clicking the "Deposit" button in the account profile.</p>
				 <p>2) After it is necessary to choose a method of depositing the account (the Company offers a lot of convenient methods that are available to the Client and are displayed in his individual account).</p>
				 <p>3) Next, indicate the currency in which the account will be deposited, and accordingly the currency of the account itself.</p>
				 <p>4) Enter the amount of the deposit.</p>
				 <p>5) Fill out the form by entering the requested payment details.</p>
				 <p>6) Make a payment.</p>
				 `,
		toggled: false
	},
	{
		question: "What is the minimum deposit amount?",
		answer: `<p>The advantage of the Company’s trading platform is that you don’t have to deposit large amounts to your account. You can start trading by investing a small amount of money. The minimum deposit is 10 US dollars.</p>`,
		toggled: false
	},
	{
		question: "Is there any fee for depositing or withdrawing funds from the account?",
		answer: `<p>No. The company does not charge any fee for either the deposit or for the withdrawal operations.</p>
				 <p>However, it is worth considering that payment systems can charge their fee and use the internal currency conversion rate.</p>`,
		toggled: false
	},
];

export interface IFaq {
    question: string;
    answer: string;
    toggled: boolean;
}
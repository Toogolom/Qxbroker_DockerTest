export const faq: IFaq[] = [
	{
		question: "How to withdraw money from the account?",
		answer: `<p>The procedure for withdrawing capital is extremely simple and is carried out through your individual account.</p>
				 <p>The method that you have chosen to deposit the account is also a method of withdrawing funds (see the question "How can I deposit?").</p>
				 <p>For example, if you made a deposit to your account via the Visa payment system, you will also withdraw money via the Visa payment system.</p>
				 <p>When it comes to the withdrawal of a sufficiently large amount, the Company may request verification (verification is requested at the Company's sole discretion), which is why it is very important to register an account individually for yourself in order to confirm your rights to it at any time.</p>`,
		toggled: false
	},
	{
		question: "How long does it take to withdraw funds?",
		answer: `<p>On average, the withdrawal procedure takes from one to five days from the date of receipt of the corresponding request of the Client and depends only on the volume of simultaneously processed requests. The company always tries to make payments directly on the day the request is received from the Client.</p>`,
		toggled: false
	},
	{
		question: "What is the minimum withdrawal amount?",
		answer: `<p>The minimum withdrawal amount starts from 10 USD for most payment systems.
				 <br>
					For cryptocurrencies this amount starts from 50 USD (and may be higher for certain currencies e.g. Bitcoin).
				 </p>`,
		toggled: false
	},
	{
		question: "Is there any fee for depositing or withdrawing funds from the account?",
		answer: `<p>No. The company does not charge any fee for either the deposit or for the withdrawal operations.</p>
				 <p>However, it is worth considering that payment systems can charge their fee and use the internal currency conversion rate.</p>`,
		toggled: false
	},
	{
		question: "Do I need to provide any documents to make a withdrawal?",
		answer: `<p>Usually, additional documents to withdraw funds are not needed . But the Company at its discretion may ask you to confirm your personal data by requesting certain documents. Usually this is done in order to prevent activities related to illegal trade, financial fraud, as well as the use of funds obtained illegally.</p>
				 <p>The list of such documents is minimum, and the operation to provide them will not take you much time and effort.</p>`,
		toggled: false
	},
	{
		question: "What is account verification?",
		answer: `<p>Verification in binary options is a confirmation by the Client of his personal data by providing the Company with additional documents. Verification conditions for the Client are as simple as possible, and the list of documents is minimum. For example, a Company may ask:</p>
				 <ul>
					 <li>provide a color scan copy of the first spread of the Client's passport (passport page with photo)</li>
					 <li>identify with the help of a "selfie" (photograph of himself)</li>
					 <li>confirm the address of registration (residence) of the Client, etc</li>
				 </ul>
				 <p>The Company may request any documents if it is not possible to fully identify the Client and the data entered by him.</p>
				 <p>After the electronic copies of documents have been submitted to the Company, the Client will have to wait some time to verify the data provided.</p>
				`,
		toggled: false
	},
	{
		question: "How to understand that I need to go through account verification?",
		answer: `<p>If it becomes necessary to pass verification, you will receive a notification by e-mail and / or SMS notification.</p>
				 <p>However, the Company uses the contact details that you specified in the registration form (in particular, your email address and phone number). Therefore, be careful to provide relevant and correct information.</p>`,
		toggled: false
	},
	{
		question: "How long does the verification process take?",
		answer: `<p>No more than 5 (five) business days from the date the Company receives the requested documents.</p>`,
		toggled: false
	},
	{
		question: "How do I know that I successfully passed verification?",
		answer: `<p>You will receive a notification by e-mail and / or SMS notification about the completion of the verification process of your account and the ability to proceed with operations on the Company's trading platform.</p>`,
		toggled: false
	}
];

export interface IFaq {
    question: string;
    answer: string;
    toggled: boolean;
}
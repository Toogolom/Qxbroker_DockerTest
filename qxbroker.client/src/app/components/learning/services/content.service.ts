import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ContentService {
	constructor() { }

	private sections = [
		{
			id: 0,
			title: 'Trading basics',
			icon: 'icon-book',
			description: '<p>Welcome to trading training. Trading is an opportunity to make money, but it may involve certain financial risks. You will learn to understand the laws by which the market lives, control and even reduce financial risks.</p>',
			topics: [
				{
					id: 0,
					title: 'What is trading and why is it important?',
					subtopics: [
						{
							id: 0,
							title: 'Introduction to trading',
							content: `<img src='/assets/images/learning/trading-basics/1.png'>
									  <p>The main purpose of trading is to make a profit on asset trading. It can be money, stocks, commodities, cryptocurrencies, and more.</p>
									  <p>You can earn money by buying and selling an asset. When a trader buys an asset, he hopes that the asset will rise in price and it will be possible to sell it more expensive.</p>
									  <p>When a trader sells an asset, he expects to be able to make money by buying back the asset at an even lower price. In fact, the trader sells what he does not own.</p>
									`,
						},
						{
							id: 1,
							title: 'How to trade successfully?',
							content: `<p>In order to predict the future market value of assets and make money from it, traders use various strategies.</p>
									  <p>One possible strategy is to work with the news. As a rule, it is chosen by beginners.</p>
									  <p>Advanced traders take into account many factors, use indicators, and are able to predict trends.</p>
									  <p>However, even professionals have unprofitable deals. Fear, uncertainty, lack of patience or a desire to earn more bring losses even to experienced traders. Simple rules of risk management help to keep emotions under control.</p>
									`,
						},
					],
				},
				{
					id: 1,
					title: 'Assets',
					subtopics: [
						{
							id: 0,
							title: 'What are assets?',
							content: `<img src='/assets/images/learning/trading-basics/2.png'>
									 <p>Assets in the world of trading are commodities. They include money, securities, raw materials, indices and digital currencies. The price of an asset is affected by the volume of transactions that are made on this asset. The more often an asset is bought, the more the price rises. If an asset starts to be actively sold, the price falls. The fluctuation of the asset value per unit of time is called volatility.</p>
									 <p>The main goal of traders is not to buy a commodity, but to make a profit due to the difference between the purchase price and the sale price. This means that you can earn money both when the asset value rises and when it falls.</p>
									 <p>There are 5 main types of assets: currency pairs, stocks, indices, commodity assets, cryptocurrencies.</p>
									`,
						},
						{
							id: 1,
							title: 'Stocks and indices',
							content: `<p>The features of trading stocks and indices are similar. Stocks are securities that give the owner the right to receive dividends and a part of the company's assets in the event of its sale. And indices reflect the state of the securities market.</p>
									  <p>Compared to currency pairs, stocks and indices are less risky instruments due to lower volatility. They are better suited for longer-term transactions and long-term investing.</p>
									`,
						},
						{
							id: 2,
							title: 'Commodities',
							content: `<p>Commodities include oil, gas, and metals. Commodities tend to be highly volatile and provide a large number of intraday trading signals.</p>`
						}
					],
				},
				{
					id: 2,
					title: 'Bulls and Bears',
					subtopics: [
						{
							id: 0,
							title: 'Bulls',
							content: `<img src='/assets/images/learning/trading-basics/3.png'>
									  <p>Depending on their trading style, traders are divided into bulls and bears.</p>
									  <p>Bulls buy assets in the hope of their future growth. The main task of a bull is to buy cheap and later sell more expensive.</p>
									  <p>If there are many people willing to buy an asset, the price of the asset rises. This trend is called "bullish" - by analogy with a bull that throws its victim up with its horns.</p>
									`,
						},
						{
							id: 1,
							title: 'Bears',
							content: `<p>Bears sell assets in the hope that their price will decrease in the future. The bear sells the asset cheaply, waits for the price to decrease, and buys the sold asset back at an even lower price. As a result, the trader also gets a profit on the account.</p>
									  <p>If the number of bears exceeds the number of bulls, the price of the asset begins to fall. This trend is called "bearish" - by analogy with a bear hitting its victim with its paw from top to bottom.</p>
									  <p>The confrontation between bulls and bears on any asset occurs every second. This change is recorded by the chart.</p>
									`
						}
					],
				},
				{
					id: 3,
					title: 'Trading hours on the stock exchange',
					subtopics: [
						{
							id: 0,
							title: 'Forex trading sessions',
							content: `<img src='/assets/images/learning/trading-basics/4.png'>
							  <p>The currency market is available to traders all over the world 24 hours a day. This is due to the fact that traders live in different time zones. When traders in one time zone finish trading, the trading session is just beginning on the other side of the world. Exceptions are weekends - Saturday, Sunday and national holidays, when world exchanges are off. However, this does not apply to crypto assets, which are traded 24 hours a day, 7 days a week.</p>
							`,
						},
						{
							id: 1,
							title: 'Trading sessions on the exchanges',
							content: `<p>Some assets, such as stocks and ETFs, are only available for trading during a certain period of the day. This feature is explained by the operating hours of the exchanges where these instruments are traded.</p>
									  <p>To ensure that your trading is successful, it is worth considering which trading session you are working in. There are four trading sessions - European, American, Asian and Pacific, and each of them has its own characteristics.</p>
									`,
						},
						{
							id: 2,
							title: 'European session',
							content: `<p>The European session opens at 07:00 to 16:00 GMT. This session accounts for the majority of Forex transactions.</p>
									  <p>Working during the European session is suitable for those who prefer active trading. This situation is ideal for obtaining high profits, but remember - it is also associated with high risks.</p>
									`
						},
						{
							id: 3,
							title: 'American session',
							content: `<p>The American session starts at 12:00 and closes at 21:00 GMT. The activity in the American session is comparable to the activity in the European session. It is considered that this is the best time for scalping trading.</p>
									  <p>The peculiarity of scalping is the conclusion of short transactions: up to several minutes. Usually, the result is the opening of a large number of transactions, each of which brings a small result. If this style is close to you, this is your choice.</p>
									`
						},
						{
							id: 4,
							title: 'Asian session',
							content: `<p>The Asian session opens at 23:00 and closes at 08:00 GMT. It is characterized by large trading volumes. Remember: the mood of the entire trading day depends on how the situation develops during the Asian session.</p>`,
						},
						{
							id: 5,
							title: 'Pacific session',
							content: `<p>The Pacific session starts at 21:00 and ends at 06:00 GMT.</p>
									  <p>This time is considered the calmest - the value of assets fluctuates in a narrow price range.</p>
									`,
						},
						{
							id: 6,
							title: 'Important notes',
							content: `<p>The most active trading is always in the first three hours of the session. Try to get there at this time.</p>
									  <p>But even in a quiet market you can find many profitable moments if you are a supporter of short-term trading.</p>
									`,
						}
					]
				},
				{
					id: 4,
					title: 'The most dangerous emotions of a trader',
					subtopics: [
						{
							id: 0,
							title: 'Psychology of trading',
							content: `<img src='/assets/images/learning/trading-basics/5.png'>
									  <p>To trade successfully, you need to not only know the theory, but also be able to manage your emotions. Under the influence of feelings, a trader can forget about his strategy and commit an irrational act - for example, sell positions at an unfavorable price or get involved in a losing deal. To prevent this from happening, it is important to learn to recognize dangerous emotions and deal with them.</p>
									`,
						},
						{
							id: 1,
							title: 'Optimism',
							content: `<p>Optimism motivates traders to buy and believe that the uptrend will continue. It is difficult to trade the stock market without optimism. However, excessive optimism, not based on technical analysis, is a common cause of losing money due to overconfidence in trading near a trend reversal.</p>
									`,
						},
						{
							id: 2,
							title: 'Pessimism',
							content: `<p>Pessimism makes people sell stocks, be cautious, and be suspicious of uptrends. Reasonable pessimism saves an investor from reckless purchases. However, excessive fears prevent a trader from making a profit and taking advantage of positive market situations.</p>
									`,
						},
						{
							id: 3,
							title: 'Fear',
							content: `<p>Fear deprives a trader of the opportunity to make money, forcing him to exit trades and sell positions at too low a price. Anxious investors often foresee a downward trend, which makes them reluctant to buy. Those who give in to fear most of the time soon realize that the stock market is not their true goal.</p>
									  <p>That is why you should always stick to a trading strategy. This way you will be sure that you are doing everything right and protect yourself from spontaneous decisions based on fear.</p>
									`,
						},
						{
							id: 4,
							title: 'Greed',
							content: `<p>Greed is a tricky emotion that a sophisticated investor must be able to manage. Greed often leads to false self-confidence. This pushes you to buy near a trend reversal.</p>
									  <p>When a trader is greedy, he tries to get too much profit and deviates from the strategy. Greed deprives a person of the ability to think soberly and objectively. The trader does not exit the deal in time, neglects adequate risk management. All this can lead to losses.</p>
									  <p>So always stick to your trading plan, even if it seems to you that it is not so profitable. Of course, this advice is relevant if you are confident in your strategy.</p>
									`,
						},
						{
							id: 5,
							title: 'Hope',
							content: `<p>If fear discourages a trader from taking action, then hope, on the contrary, keeps him in a losing deal. These emotions go hand in hand. If the investment is successful, hope turns into pride, and in case of failure - into regret and fear. An adequate assessment of your transactions and a good understanding of how the market works helps against the harmful influence of hope.</p>
									`,
						},
						{
							id: 6,
							title: 'Regret',
							content: `<p>It is normal to feel regret over a lost profit or a losing trade. But if you focus too much on sadness and disappointment, you can become distracted and lose motivation. To turn off your emotions, analyze the failed trade and understand what went wrong, and then try to distract yourself, for example, by looking at other potential opportunities. This can be difficult at times, but a trader must be able to manage his emotions.</p>
									`,
						}
					]
				},
				{
					id: 5,
					title: 'What are trading strategies and what are they for?',
					subtopics: [
						{
							id: 0,
							title: 'What is a trading strategy',
							content: `<p>To predict the price of a particular asset and get maximum profit, traders use trading strategies. The strategy includes an investment plan, risk factors and time characteristics.</p>
									  <p>There are many trading strategies, but they can all be divided into two types that differ in their approach to predicting the price of an asset. This can be technical or fundamental analysis.</p>
									`,
						},
						{
							id: 1,
							title: 'Technical and Fundamental Analysis for Trading Strategies',
							content: `<p>In the case of strategies based on technical analysis, the trader identifies market patterns. For this, graphical constructions, figures and indicators of technical analysis, as well as candlestick patterns are used. Such strategies usually imply strict rules for opening and closing transactions, setting limits on losses and profits (stop-loss and take-profit orders).</p>
									  <p>Unlike technical analysis, fundamental analysis is carried out "manually". The trader develops his own rules and criteria for selecting transactions and makes a decision based on the analysis of market mechanisms, the exchange rate of national currencies, economic news, revenue growth and profitability of a particular asset. This method of analysis is used by more experienced players.</p>
									`,
						},
						{
							id: 2,
							title: 'Why do you need trading strategies?',
							content: `<p>Trading in financial markets without a strategy is a blind game: today you'll get lucky, tomorrow you won't. Most traders who don't have a specific plan of action give up trading after a few unsuccessful trades - they simply don't understand how to make a profit.</p>
									  <p>Without a system with clear rules for entering and exiting a trade, a trader can easily make an irrational decision. Market news, advice from friends and experts, even the phase of the Moon - yes, there are studies linking the position of the Moon relative to the Earth with asset movement cycles - can cause a trader to make a mistake or start too many trades.</p>
									`
						},
						{
							id: 3,
							title: 'The benefits of working with trading strategies',
							content: `<p>A strategy removes emotions from trading, such as greed, which causes traders to spend too much money or open more positions than usual. Changes in the market can cause panic, and in this case, a trader should have a ready-made plan of action.</p>
									  <p>In addition, using a strategy helps to measure and improve your performance. If you trade chaotically, there is a risk of making the same mistakes. Therefore, it is important to collect and analyze statistics of the trading plan in order to improve it and increase profits.</p>
									  <p>It is worth noting that you should not completely rely on trading strategies - it is important to always check the information. A strategy may work well in theory based on past market data, but this does not guarantee success in real-time conditions.</p>
									`
						}
					]
				}
			],
		},
		{
			id: 1,
			title: 'Learn how to trade in 30 minutes',
			icon: 'icon-clock',
			topics: [
				{
					id: 0,
					title: 'Quick start guide',
					subtopics: [
						{
							id: 0,
							title: 'Overview',
							content: '<p>Content for Quick start...</p>',
						},
					],
				},
			],
		},
		{
			id: 2,
			title: 'How to read a candestick chart',
			icon: 'icon-chart-bar',
			topics: []
		},
		{
			id: 3,
			title: 'Fundamental Analysis for the beginners',
			icon: 'icon-calendar',
			topics: []
		},
		{
			id: 4,
			title: 'Fundamental Analysis for the advanced',
			icon: 'icon-globe',
			topics: []
		},
		{
			id: 5,
			title: 'Chart',
			icon: 'icon-chart-area',
			topics: []
		},
	];
	
	public getSections() {
		return this.sections;
	}
	
	public getSectionById(sectionId: number) {
		return this.sections.find((section) => section.id === sectionId);
	}
}

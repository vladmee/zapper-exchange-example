# Zapper Exchange Example

Example app/tool for exchanging tokens using the [Zapper API](https://build.zapper.fi/)

![Zapper Exchange](https://github.com/vladmee/zapper-exchange-example/blob/main/public/presentation.png)

---

I'm using a bunch of other libraries to make this work:

- [axios](https://github.com/axios/axios) to fetch the API data
- [react-query](https://tanstack.com/query) for managing fetched data
- [viem](https://viem.sh) to actually execute the exchange transaction <!-- spell-check-ignore -->
- [zod](https://zod.dev/) to validate this data
- [zustand](https://github.com/pmndrs/zustand) to manage the user state <!-- spell-check-ignore -->
- and, obviously, [Next.js](https://nextjs.org/)

_All these are optional and easily replaceable with any solutions you're using in your project._

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create an `.env` file and add your Zapper API key. If you don't have one, it's available on request. Check their [docs](https://docs.zapper.fi/).

3. Run the development server:

```bash
npm run dev
```

4. Open [localhost:3000](http://localhost:3000) in your browser.

## Let me show you around

**Select a network** from the dropdown. These are prefetched using the [/v2/exchange/supported Zapper API](https://docs.zapper.fi/documentation#tag/Exchange/operation/ExchangeController_getSupportedExchanges) so only networks supported by Zapper are displayed.

**Input an address** or **connect a wallet** (injected only, preferably [MetaMask](https://metamask.io/)).

See all tokens found at this address through the [/v2/balances/tokens Zapper API](https://docs.zapper.fi/documentation#tag/Balances/operation/AppBalanceController_getAppBalances).

![Zapper Exchange Example](https://github.com/vladmee/zapper-exchange-example/blob/main/public/first-view.png)

**Select a token to exchange to USDC**. You can choose to exchange to any token, but USDC is hardcoded for this example (change it in [use-usdc.ts](./src/hooks/use-usdc.ts)).

**Input the amount you wish to exchange** (aka sell) of the selected token (_make sure it doesn't exceed the balance or you'll get an error_).

Once the amount is keyed in, you'll see the expected amount of USDC to receive (aka buy) based on the [/v2/exchange/price Zapper API](https://docs.zapper.fi/documentation#tag/Exchange/operation/ExchangeController_getExchangePrice).

![Zapper Exchange Price](https://github.com/vladmee/zapper-exchange-example/blob/main/public/price.png)

> This is not the final quotation! To get the final quotation and the transaction data, you have to hit Review. **But!** You can only get a quote if the spending amount is approved.

> If you connected your wallet, you can hit the Approve button and do this before hitting Review. If you input an address that's not yours and an approval wasn't performed, then you **won't be able to receive a quotation**. Make sure you handle this case accordingly in your project.

![Zapper Exchange Approve](https://github.com/vladmee/zapper-exchange-example/blob/main/public/approve.png)

> However, ETH and other native currencies don't need approval! Use that to experiment.

**Hit Review** to reveal the response of the [/v2/exchange/quote Zapper API](https://docs.zapper.fi/documentation#tag/Exchange/operation/ExchangeController_getExchangeQuote). With this data, you can safely trigger the exchange transaction for your users.

![Zapper Exchange Quote](https://github.com/vladmee/zapper-exchange-example/blob/main/public/quote.png)

> In this example, if you connected your own wallet and successfully fetched a quote, you can use the Exchange button to trigger the transaction. **THIS IS NOT JUST AN EXAMPLE** – this will call the Zapper contracts and ACTUALLY EXCHANGE your selected tokens to USDC. **Use with caution!**

> If you just input an address, it will still trigger a transaction in your wallet, but it will obviously do the exchange for your address, not the selected address. Also, **TREAT WITH CAUTION!** It might even fail if your connected address doesn't have tokens to sell or the required allowance.

## How to Test Locally Using Anvil

_Unfortunately, Zapper contracts are not deployed on testnets._

Luckily, I set up this example so you can **test using a local fork**. It works like this:

1. You fork a network locally using [Foundry's Anvil](https://book.getfoundry.sh/anvil/).
2. You're calling the Zapper API, which is listening to the actual mainnet,
3. BUT you use the quote to trigger the transaction **locally**.

> Be aware that your local fork should start from the **most recent block** and your API call and the local transaction should be done in a **timely manner with a generous slippage**; otherwise, your transaction will fail.

> Also, your local test won't change the data or status displayed in the example. The balances and the approval status will remain the same; the API doesn't know about your local state.

![Zapper Exchange Anvil](https://github.com/vladmee/zapper-exchange-example/blob/main/public/anvil.png)

Let's get started:

**Run your Anvil local fork** using the `anvil` command. You should set up Anvil locally — if you haven't used it before check their [documentation](https://book.getfoundry.sh/anvil/).

**Check the 'use anvil' checkbox**. This will let the app know to use the test client and show you the command panel.

_The commands here are personalized based on your inputs, with the provided address, selected token, and the quote data received from the Zapper API._

Once you input an address, you can cast to **impersonate that address locally**. _This will allow you to cast transactions LOCALLY as if you were that address, using the `--unlocked` flag._

You can use the **check balances** commands to see the before and after balances in your terminal: _USDC and your selected token_. So you can actually see the exchange happening.

Go through the entire flow to get a quote successfully, so you can **cast the exchange transaction**.

If successful (_you can see the response immediately in your terminal_), you can **recheck the balances** to see if the amounts changed accordingly.

> If the transaction reverted, you can check the response from the Zapper contract and adjust your configuration. It can be the slippage, the price changed, balances changed, etc. Try to rerun anvil from the latest fork if stale.

## Considerations

This project is intended solely as an example to demonstrate how to interact with the Zapper API. **Do not use this code for actual token exchanges involving real assets.** Engaging in transactions with this code could result in **permanent financial losses**. By using this code, you acknowledge that you do so at your own risk, and I am not responsible for any financial losses or other damages that may occur. Treat this project as a learning tool and exercise caution.

## Future Development

The balances shown in this example are fetched through a GET to the `/v2/balances/tokens` endpoint. This returns a **cached result** and, as the Zapper documentation [suggests](https://docs.zapper.fi/docs/apis/api-syntax), you should only use this data as initial data while doing a POST request in the background so it's updated with the most recent data. Balances returned come with an `updatedAt` date that you can use to optimize these calls. I haven't delved into that yet.

The Zapper API key is public. It **SHOULDN'T** be! Use the api routes (in case you're using Next.js) or your own server to tunnel these requests securely.

The user experience can be improved by A LOT! If you want a good example, check [Zapper.xyz dapp](https://zapper.xyz/). Use at your own risk as well, but compared to this example, their dapp can actually be used to exchange real tokens!

---

If you're building using Zapper, be considerate and give Zapper credit! As per documentation:

> We ask that builders who are using our API for free include our "Powered by Zapper" logo with a back-link to https://zapper.xyz in their project.

I'm doing so in this example and in the projects I'm building, you should do so too — it's the right thing to do!

---

_Side note:_ **Are you on Farcaster?** <!-- spell-check-ignore --> I'm ranting all day about web3 dev stuff at https://warpcast.com/vlatoshi

If you haven't joined yet consider using my [invite link](https://warpcast.com/~/invite-page/850603?id=65ab2f57)! Happy coding!

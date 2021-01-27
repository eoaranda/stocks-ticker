# Electron Stocks-ticker (AS-IS)

## Project:

This is my first electron App, maybe a little too late regarding on what is the future for electron but I needed a very minimal vertical stocks ticker app. 

Important note, the app comes AS-IS , also this was a weekend hack so expect some not tested edge cases.

## Modes

If the martket is open it will display a small sun and if closed a small moon. This is not just a visual aid, but at day it will create a direct websocket connection to update data and at night it will pull data manually every 30min.

Night Mode:

![stocks-ticker-night](assets/images/nightmode.gif  "stocks-ticker-night")

Day Mode:

![stocks-ticker-day](assets/images/daymode.gif  "stocks-ticker-day")

## Installation

  To get started:
  
* Clone the project: `https://github.com/eoaranda/stocks-ticker.git`

* Install all project dependencies with `npm install`

* Obtain a FREE api key at [Finhub.io](https://finnhub.io) and update the .env file `API_TOKEN=""` 

* In the same .env file add the stocks symbols that you are interested. ex. `STOCKS="AAPL,FB,SPCE,MSFT"`

* Start application with `npm start`

## Todo

* There is a small glitch when the app starts the ticker loads but then it gets restarted.

* Add some actions when clickin an specific stock.

## Tested Platforms
* macOS Big Sur

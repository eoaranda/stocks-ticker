const $ = require("jquery");
const api = require('./src/api-calls');
const constant = require('./src/constant');
const utils = require('./src/utils');
const data = require('./src/data');

const Init = async () => {

    console.info("1) Set Day Status");
    utils.displayMarketStatus();

    console.info("2) Register Web Sockets")
    api.RegisterWebSockets();

    console.info("3) Get Quotes Manually for stocks")
    api.getQuoteForStocks();

    console.info("4) Listen to Web Sockets")
    api.ListenWebSocket();
}

// Run task every 15 sec.
const TimeTask = () => {

    utils.displayMarketStatus();

    // if market closed then we will pull data every 30 min manually
    if (!utils.isMarketOpen()) {

        const today = new Date();
        const stocks_market_pull_time = data.getTime();

        // if empty set right now 
        if (stocks_market_pull_time.length === 0) {
            data.saveTime(today);
        }

        const dataDate = new Date(data.getTime());
        let diff = Math.abs(today - dataDate);

        if (diff >= constant.PULL_TIME_LIMIT) {
            // if 30 min or more then pull data manually
            api.getQuoteForStocks();

            // set new time 
            data.saveTime(today);
        }
    }
}

/**
 * Init
 */
(async function () {
    setInterval(TimeTask, constant.ONE_SECOND * 15);
    Init();
})();
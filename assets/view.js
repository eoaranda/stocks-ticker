const fetch = require("node-fetch");
const dotenv = require("dotenv").config();
const $ = require("jquery");
const Mustache = require("mustache");
const holidays = require('@date/holidays-us').bank()

STOCKS = process.env.STOCKS.split(",").sort();
API_TOKEN = process.env.API_TOKEN;
ONE_SECOND = 1000;
MARKET_START_TIME = "09:30:00"; // 9:30am EST
MARKET_END_TIME = "24:00:00"; // 4pm EST ~ 16:00


const socket = new WebSocket("wss://ws.finnhub.io?token=" + API_TOKEN);
let firstMarketPull = null;


/**
 * Register WebSockets
 */
const RegisterWebSockets = () => {
    let stocks = STOCKS;
    socket.addEventListener('open', function (event) {
        stocks.forEach(symbol => {
            console.info("Registering WS : ", symbol);
            socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': symbol }))
        })
    });
}


const Tasks = async () => {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = addZeroBefore(today.getHours()) + ":" + addZeroBefore(today.getMinutes()) + ":" + addZeroBefore(today.getSeconds());

    // check if week day or stocks day off ? if so just display latest date from latest day
    if (!holidays.isHoliday(today)) {
        // 1) check if the market is open 
        console.log("1) check if the market is open");
        if (time >= MARKET_START_TIME && time <= MARKET_END_TIME) {
            // 2) check if we have pulled data today
            console.log("2) check if we have pulled data today");
            if (date == firstMarketPull) {
                // 3) we have pulled data previously so now we just want to update with sockets...
                console.log("3) we have pulled data previously so now we just want to update with sockets...")
                // Listen for messages
                // {"c":null,"p":31893.21,"s":"BINANCE:BTCUSDT","t":1611632010804,"v":0.0005},
                socket.addEventListener('message', function (event) {
                    let jsonData = JSON.parse(event.data);
                    console.log(jsonData);
                    //displayTickers(stocksData);
                });

            } else {
                // 4) We will make the first pull of the day...
                console.log("4) We will make the first pull of the day...")
                firstMarketPull = date; // set first pull of the day
                let stocksData = await getQuoteForStocks();
                displayTickers(stocksData);
            }
        } 
    }
}

/**
 * @param {*} symbol 
 * @param {*} currentPrice 
 * @param {*} openPrice 
 * Main function to build the Stocks Object that will get populated in the view
 */
const buildQuoteData = (symbol, currentPrice, openPrice) => {
    let stockPercentData = calculateStockPercent(currentPrice, openPrice);
    symbol = symbol.replace("BINANCE:", "");
    const stocksObject = {
        name: symbol,
        price: parseFloat((currentPrice).toFixed(2)).toLocaleString('en'),
        difference: parseFloat((currentPrice - openPrice).toFixed(2)).toLocaleString('en'),
        percent: stockPercentData.percentText,
        arrow: stockPercentData.arrow,
        style: stockPercentData.style
    };
    return stocksObject;
}


/*
Make API request to server
*/
const getSymbolQuoteData = async (symbol) => {
    let response = await fetch("https://finnhub.io/api/v1/quote?symbol=" + symbol + "&token=" + API_TOKEN);
    let data = await response.json();
    return buildQuoteData(symbol, data.c, data.o);
};

/*
Quick function to calculate Percents
*/
const calculateStockPercent = (currentPrice, openPrice) => {
    let percent = ((currentPrice - openPrice) / openPrice) * 100;
    let alert = false;
    let arrow = percent > 0 ? "fa-angle-up" : "fa-angle-down";
    let style = percent > 0 ? "stock-up" : "stock-down";
    style += alert ? ' alert-blink' : '';
    return { percentValue: percent, percentText: percent.toFixed(2) + "%", arrow: arrow, style: style };
};

/*
Process api stocks and generate stock Object
*/
const getQuoteForStocks = async () => {
    let stocks = STOCKS;
    let stocksData = [];

    try {
        for (let symbol of stocks) {
            stocksData.push(await getSymbolQuoteData(symbol));
        }
    } catch (e) {
        console.log("Error, data could not be loaded: ", e);
    }
    return stocksData;
};

const displayTickers = (stocksData) => {
    let data = { stocks: stocksData };
    console.log(data);
    (template = $("#template").html()),
        (output = Mustache.render(template, data));
    $("#marquee").append(output);
}

const addZeroBefore = (n) => {
    return (n < 10 ? '0' : '') + n;
}

/**
 * INIT
 */
(async function () {
    RegisterWebSockets();
    setInterval(Tasks, ONE_SECOND * 10);
})();
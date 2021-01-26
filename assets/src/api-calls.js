const fetch = require("node-fetch");
const constant = require('./constant');
const utils = require('./utils');
const data = require('./data');

const socket = new WebSocket("wss://ws.finnhub.io?token=" + constant.API_TOKEN);


/*
Process api stocks and generate stock Object
*/
const getQuoteForStocks = async () => {
    console.log("get quote dat amanuallt");
    let stocks = constant.STOCKS;
    let quoteData;
    try {
        for (let symbol of stocks) {
            quoteData = await getSymbolQuoteData(symbol)
            data.STOCKS_DATA_OBJECT[symbol] = quoteData;
        }
        utils.displayTickers(data.STOCKS_DATA_OBJECT);
    } catch (e) {
        console.log("Error, data could not be loaded: ", e);
    }
};

/**
 * Make API request to server
 */
const getSymbolQuoteData = async (symbol) => {
    let response = await fetch("https://finnhub.io/api/v1/quote?symbol=" + symbol + "&token=" + constant.API_TOKEN);
    let data = await response.json();
    return utils.buildQuoteData(symbol, data.c, data.o);
};

/**
 * Register WebSockets
 */
const RegisterWebSockets = () => {
    let stocks = constant.STOCKS;
    socket.addEventListener('open', function (event) {
        stocks.forEach(symbol => {
            socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': symbol }))
        })
    });
}

/**
 * Listen WebSockets
 */
const ListenWebSocket = () => {
    let latestStock;
    socket.addEventListener('message', function (event) {
        let jsonData = JSON.parse(event.data).data;
        
        if (jsonData) {
            latestStock = jsonData[jsonData.length - 1];
        }

        let previousStock = data.STOCKS_DATA_OBJECT[latestStock.s];
        let newStock = utils.buildQuoteData(latestStock.s, latestStock.p, previousStock.openPrice);

        if (previousStock.price != newStock.price) {
            data.STOCKS_DATA_OBJECT[latestStock.s] = newStock;
            utils.displayTickers(data.STOCKS_DATA_OBJECT);
        }
    });
}

module.exports = {
    getSymbolQuoteData: getSymbolQuoteData,
    RegisterWebSockets: RegisterWebSockets,
    ListenWebSocket: ListenWebSocket,
    getQuoteForStocks: getQuoteForStocks
};

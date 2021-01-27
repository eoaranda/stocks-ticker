const holidays = require('@date/holidays-us').bank()
const constant = require('./constant');

var template = document.getElementById("template");
var templateHtml = template.innerHTML;

// manual templating, mustache sucked
const renderTemplate = (dataObject) => {
  var listHtml = "";
  for (var key in dataObject) {
    listHtml += templateHtml.replace(/{{name}}/g, dataObject[key].name)
      .replace(/{{name}}/g, dataObject[key]["name"])
      .replace(/{{price}}/g, dataObject[key]["price"])
      .replace(/{{style}}/g, dataObject[key]["style"])
      .replace(/{{arrow}}/g, dataObject[key]["arrow"])
      .replace(/{{percent}}/g, dataObject[key]["percent"])
      .replace(/{{difference}}/g, dataObject[key]["difference"]);
  }
  document.getElementById("marquee").innerHTML = listHtml;
}

const addZeroBefore = (n) => {
  return (n < 10 ? '0' : '') + n;
}

const cleanSymbol = (symbol) => {
  let cleanSymbol = symbol.replace("BINANCE:", "");
  return cleanSymbol;
}

const isMarketOpen = () => {
  let marketStatus = false;
  const today = new Date();
  const time = utils.addZeroBefore(today.getHours()) + ":" + utils.addZeroBefore(today.getMinutes()) + ":" + utils.addZeroBefore(today.getSeconds());
  if (!holidays.isHoliday(today) && (time >= constant.MARKET_START_TIME && time <= constant.MARKET_END_TIME)) {
    marketStatus = true;
  }
  return marketStatus;
}

const displayMarketStatus = () => {
  let statusIcon = isMarketOpen() ? "<span id='market-status-day'><i class='fa fa-sun-o' style='font-size: 20px'></i></span>" : "<span id='market-status-night'><i class='fa fa-moon-o' style='font-size: 20px'></i></span>";
  document.getElementById("market-status").innerHTML = statusIcon;
}

/**
Quick function to calculate Percents
*/
const calculateStockPercent = (currentPrice, previousPrice) => {
  let percent = ((currentPrice - previousPrice) / previousPrice) * 100;
  let alert = Math.abs(percent) >= 2 ? true : false;
  let arrow = percent > 0 ? "fa-angle-up" : "fa-angle-down";
  let style = percent > 0 ? "stock-up" : "stock-down";
  style += alert ? ' alert-blink' : '';
  return { percentValue: percent, percentText: percent.toFixed(2) + "%", arrow: arrow, style: style };
};

/**
Display Tickers Screen, we render data to screen
*/
const displayTickers = (stocksData) => {
  renderTemplate(stocksData)
}

/**
 * Main function to build the Stocks Object that will get populated in the view
 */
const buildQuoteData = (symbol, currentPrice, previousPrice) => {
  let stockPercentData = calculateStockPercent(currentPrice, previousPrice);
  const stocksObject = {
    name: cleanSymbol(symbol),
    previousClosePrice: previousPrice,
    price: parseFloat((currentPrice).toFixed(2)).toLocaleString('en'),
    difference: parseFloat((currentPrice - previousPrice).toFixed(2)).toLocaleString('en'),
    percent: stockPercentData.percentText,
    arrow: stockPercentData.arrow,
    style: stockPercentData.style
  };
  return stocksObject;
}

module.exports = {
  addZeroBefore: addZeroBefore,
  calculateStockPercent: calculateStockPercent,
  displayTickers: displayTickers,
  buildQuoteData: buildQuoteData,
  displayMarketStatus: displayMarketStatus,
  isMarketOpen: isMarketOpen
};

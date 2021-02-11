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

const setMarqueeConfigurations = (speed) => {
  speed = speed !== undefined ? speed : 5;
  document.getElementById("marquee").setAttribute("scrollamount", speed);
}

/**
Quick function to calculate Percents
*/
const calculateStockPercent = (currentPrice, previousPrice) => {
  let percent = ((currentPrice - previousPrice) / previousPrice) * 100;
  let alert = Math.abs(percent) >= constant.BLINK_ALERT_THRESHOLD ? true : false;
  let stockDirection = percent > 0 ? 'up' : 'down';
  let arrow = "fa-angle-" + stockDirection;
  let style = "stock-" + stockDirection;
  style += alert ? ' alert-blink-'+stockDirection : '';
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
  isMarketOpen: isMarketOpen,
  setMarqueeConfigurations: setMarqueeConfigurations
};

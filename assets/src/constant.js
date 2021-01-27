const dotenv = require("dotenv").config();

const STOCKS = process.env.STOCKS.split(",").sort();
const API_TOKEN = process.env.API_TOKEN;
const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const MARKET_START_TIME = "09:00:00"; // EST
const MARKET_END_TIME = "16:30:00"; // EST
const PULL_TIME_LIMIT = ONE_MINUTE * 30;

module.exports = {
  STOCKS: STOCKS,
  API_TOKEN: API_TOKEN,
  ONE_SECOND: ONE_SECOND,
  ONE_MINUTE: ONE_MINUTE,
  MARKET_START_TIME: MARKET_START_TIME,
  MARKET_END_TIME: MARKET_END_TIME,
  PULL_TIME_LIMIT: PULL_TIME_LIMIT
};

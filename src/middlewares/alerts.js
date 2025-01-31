const axios = require("axios");
require('dotenv').config();

const telegramApi = axios.create({
  baseURL: `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`,
  timeout: 5000,
});

module.exports = telegramApi;

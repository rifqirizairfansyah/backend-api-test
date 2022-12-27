const axios = require("axios");

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.MAIL_PRODUCTIONS : process.env.MAIL_DEV
})

module.exports = {
  instance
}

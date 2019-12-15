let request = require('request');
require('dotenv').config();

request('https://rest.coinapi.io/v1/exchangerate/BTC?apikey=' + process.env.COIN_API_KEY, (error, response, body) => {
    console.log(process.env.COIN_API_KEY);
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
});

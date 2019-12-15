let request = require('request');
require('dotenv').config();

module.exports.requestCoin = function(coin) {
    return new Promise((resolve, reject) => {
        request('https://rest.coinapi.io/v1/exchangerate/' + coin + '?apikey=' + process.env.COIN_API_KEY, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(body);
            } else {
                reject('Error occurred when attempting to reqest coin.');
            }
        });
    });

}

module.exports.requestCoinNames = function() {
    return new Promise((resolve, reject) => {
        request('https://rest.coinapi.io/v1/exchanges?apikey' + process.env.COIN_API_KEY, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let coins = {};
                for (let coin of body) {
                    coins.push({
                        exchange_id: coin.exchange_id,
                        name: coin.name
                    });
                }
    
                resolve(coins);
            } else {
                reject('Error occurred when attempting to request coins.')
            }
        });
    });
}

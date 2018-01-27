const Exchanges = require('crypto-exchange');
const config = require('../../config/config.js');
const storage = require('../../storage/StorageService.js');
const fs = require('fs');
const util = require('util');

const key = config.getGeminiKey();
const secret = config.getGeminiSecret();

const timeout = 60000;
const interval = 660000;

module.exports = {
  process: async () => {
    const fsread = util.promisify(fs.readFile);
    const result = await fsread('trading_pairs_bitfinex.json');
    const strResult = new Buffer(result, 'UTF-8').toString();
    const json = JSON.parse(strResult);

    // 10 requests per minute ~110 items
    console.log('Start bifinex service');
    var index = 1;
    for (var id = 0; id < json.length; id++) {
      if (id % 10 === 0) {
        index += 1;
      }
      var pair = [json[id]];
      setTimeout(() => module.exports.pollingWithInterval(pair), index * timeout);
    }
  },

  pollingWithInterval: async (pairs) => {
    return setInterval(() => module.exports.polling(pairs), interval);
  },

  polling: async (pairs) => {
    return await Exchanges.bitfinex
      .ticker(pairs)
      .then((result) => {
        console.log(result);
        return storage.save(module.exports.getTable(), result, pairs); 
      })
  },

  getTable: () => {
    return 'table_bitfinex_unified';
  }
};

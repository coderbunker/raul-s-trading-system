const Exchanges = require('crypto-exchange');
const config = require('../../config/config.js');
const storage = require('../../storage/StorageService.js');
const fs = require('fs');
const util = require('util');

const key = config.getGeminiKey();
const secret = config.getGeminiSecret();

const interval = 60000;

module.exports = {
  process: async () => {
    const fsread = util.promisify(fs.readFile);
    const result = await fsread('trading_pairs_gemini.json');
    const strResult = new Buffer(result, 'UTF-8').toString();
    const json = JSON.parse(strResult);

    setInterval(() => module.exports.polling(json), interval);
  },

  polling: async function(pairs) {
    return await Exchanges.gemini
      .ticker(pairs)
      .then((result) => {
        console.log(result);
        return storage.save(module.exports.getTable(), result, pairs); 
      })
  },

  getTable: () => {
    return 'table_gemini_unified';
  }
};

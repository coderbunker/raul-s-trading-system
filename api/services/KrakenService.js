const Exchanges = require('crypto-exchange');
const config = require('../../config/config.js');
const storage = require('../../storage/StorageService.js');
const fs = require('fs');
const util = require('util');

const key = config.getGeminiKey();
const secret = config.getGeminiSecret();

const interval = 60000;
const krakenPollingTimeShift = 60000;

module.exports = {
  process: async () => {
    const fsread = util.promisify(fs.readFile);
    const result = await fsread('trading_pairs.json');
    const strResult = new Buffer(result, 'UTF-8').toString();
    const json = JSON.parse(strResult);
        
    try {
      let index = 1;
      for (var id = 0; id < json.length; id++) {
        if (id % 10 === 0) {
          console.log('increase timeshift');
          index += 1;
          var timeShift = krakenPollingTimeShift * index;
        }
        let pair = json[id];
        console.log('Pair: ' + pair);
        setTimeout(() => module.exports.polling(pair), timeShift);
      }
    } catch(e) {
      console.log('Error: ' + e);
    }
  },

  polling: async function(pairs) {
    return await Exchanges.kraken
      .ticker(pairs)
      .then((result) => {
        return storage.save('table_kraken_unified', result, pairs); 
      })
  },

  getTable: () => {
    return 'table_gemini_unified';
  }
};

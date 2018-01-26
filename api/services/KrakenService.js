const pg = require('pg');
const config = require('../../config/config.js');
const storage = require('../../storage/StorageService.js');
const fs = require('fs');
const util = require('util');
const KrakenClient = require('kraken-api');
const kraken       = new KrakenClient(config.getKrakenKey(), config.getKrakenSecret());

const postresqlUrl = 'postgres://postgres:postgres@localhost:5432/postgres';

const krakenTimePollingInterval = 6 * 60000;
const krakenPollingTimeShift = 60000;
let pollingCount = 0; 

const client = new pg.Client(postresqlUrl);
client.connect();

module.exports = {
  process: async function() {
    // TODO process data from kraken
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
    // json.forEach(pair => {
    //   // console.log('for each: ' + pair);
    //   index += 1;
    //   var timeShift = krakenPollingTimeShift * index;
    //   // console.log('Timeshift: ' + timeShift);
    //   setTimeout(() => module.exports.polling(pair), timeShift);
    // });

    // TODO split data set on chunks and run it one by one
    // TODO run at least one data set

    // OHC
    console.log('runFunc');
    var pairValue = 'XZECZUSD';

    // setInterval(module.exports.runFunc(pairValue), 10000);

    // TODO run polling for each data set chunks 
    // setInterval(() => { module.exports.runFunc(pairValue) }, krakenTimePollingInterval);

    // setTimeout(module.exports.polling, 5000);

    // kraken.api('OHLC', {pair: pairValue, interval: 1 })
    //   .then((result) => {
    //     return module.exports.saveData(result, pairValue); 
    //   })
    //   .then((err, result) => {
    //     // TODO run it again by timer
    //     // TODO catch exception at the end
    //     console.log('schedule request again');
    //   });
    // const ohlcResult = await kraken.api('OHLC', {pair: 'XXBTZUSD', interval: 1 });
    // console.log('OHLC: ' + ohlcResult.toString());
    console.log('New request');
  },

  runFunc: async function(pairValue) {
    return await kraken.api('OHLC', { pair: pairValue, interval: 1 })
      .then((result) => {
        console.log('Receive results');
        return storage.saveData(result, pairValue); 
      })
      // .then((err, result) => {
      //   // TODO run it again by timer
      //   // TODO catch exception at the end
      //   console.log('schedule request again');
      // });
  },

  polling: async function(pairValue) {
    console.log('polling: ' + pairValue);
    // return setInterval(() => {module.exports.debug(pair)}, 10000);
    return await kraken.api('OHLC', { pair: pairValue, interval: 1 })
      .then((result) => {
        console.log('Receive results');
        return storage.saveData(result, pairValue); 
      })
  },

  debug: async function(pair) {
    pollingCount += 1;
    return console.log('polling: ' + pair + ' ' + pollingCount);
  },
}
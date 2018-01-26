const pg = require('pg');
const config = require('../config/config.js');

const postresqlUrl = 'postgres://postgres:postgres@localhost:5432/postgres';

const client = new pg.Client(postresqlUrl);
client.connect();

module.exports = {

  save: async (table, json, pairs) => {
    pairs.forEach(pair => {
      module.exports.insertData(table, json[pair], pair);
    });
  },
 
  insertData: async (table, data, pair) => {
    // TODO implement insert into unified table
    console.log('Insert into unified table');
    let callback = function(err, result) {
      console.log('Error: ' + err);
      console.log('Result: ' + JSON.stringify(result));
    };
    
    const values = await module.exports.getRows(pair, data);
    console.log('Values: ' + values); 
    client.query(
      'INSERT INTO ' + table + ' (pair,last,ask,bid,high,low,volume,timestamp)' 
      + ' values ($1, $2, $3, $4, $5, $6, $7, $8) ',
      values,
      callback
    );
  },

  getRows: async (pair, data) => {
    var result = [];
    result.push(pair);
    result.push(data.last);
    result.push(data.ask);
    result.push(data.bid);
    result.push(data.high);
    result.push(data.low);
    result.push(data.volume);
    result.push(data.timestamp);
    return result;
  },

  saveData: async function(json, pair) {
    json.result[pair].forEach(row => {
      console.log('save data: forEach');
      module.exports.insertLegacyData(row);
    });
  },

  insertLegacyData: async function(data) {
    let callback = function(err, result) {
      console.log('Error: ' + err);
      console.log('Result: ' + JSON.stringify(result));
    };

    client.query(
      'INSERT INTO table_kraken_ohlc (time,open,high,low,close,vwap,volume,count)' 
      + ' values ($1, $2, $3, $4, $5, $6, $7, $8) ',
      data,
      callback
    );
  },

  queryData: async function() {
    client.query('SELECT * FROM table_kraken_ohlc', (error, result) => {
      console.log('amount of rows: ' + result.rows.length);
      return rows;
    });
  }
}
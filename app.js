const http = require('http');
const net = require('net');
// modules 
const config = require('./config/config.js');
const kraken = require('./api/services/KrakenService.js');
const gemini = require('./api/services/GeminiService.js');

const fs = require('fs');
const util = require('util');

// TODO
// 1. run server
// 2. server collect data from multiple sources - I want to run data collection from
// 3. server save data into local cache
// 4. local cache flushed into data storage
// 5. web client requests server for the data
// 6. wb server return processed data (graph with applied strategy)

run();

async function run() {
	// TODO write test for asking API and check if the data into database
	// TODO process list of data sources 
	// kraken.insertData()
	// 	.then(result => {
	// 		return kraken.queryData();
	// 	})
	// 	.then(result => {
	// 		console.log(JSON.stringify(result));
	// 	});
	// await getKrakenData();
	// await getBitstamp();

	await gemini.process();
}

// region data source

async function getKrakenData() {
	// TODO prepare list of currency pairs to process
		// TODO process buy slots
		// TODO process sell slots
		// TODO process volume
	const result = await kraken.process();
}

async function getBitstamp() {
	const result = await gemini.process();
	console.log('Result: ' + result); 
}

// endregion

net.createServer(function(socket) {
  socket.on('data', function(data) {
    console.log(data.toString());
  });
  
  socket.end('end', function() {
    console.log('client disconnected');
  });
}).listen(config.getPort(), config.getHost());

// let isPolling = false;

// var client = new net.Socket();

// client.on('data', function(data) {
// 	console.log('Received: ' + data);
// 	client.destroy(); // kill client after server's response
// });

// client.on('close', function() {
// 	console.log('Connection closed');
// 	isPolling = false;
// });

// function requestDataFromDataSources() {
// 	console.log('requestDataFromDataSources');
// 	while(true) {
// 		// TODO process data from server
// 		if (!isPolling) {
// 			console.log('try to connect');
// 			isPolling = true;
// 			client.connect(config.getPort(), config.getHost(), function() {
// 				console.log('Connected');
// 				client.write('Hello, server! Love, Client.');
// 			});
// 		}
// 	}
// }
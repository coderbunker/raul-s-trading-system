var config = require('../../config/config.js')
var net = require('net');

module.exports = {
  connection: null,

  connect: function(cb) {
    var self = this;

    this.connection = net.connect({ port: config.getPort() }, cb);

    // response router
    this.connection.on('data', function(data) {
      var res = JSON.parse(data.toString());
      self.connection.emit(res.req, res.msg);
    });
  }, 

  // close connection
  disconnect: function() {
    this.connection.end();
  },

  command: function(cmd) {
    this.connection.write(cmd);
    // return an instance of event emmitter
    return this.connection;
  }
}
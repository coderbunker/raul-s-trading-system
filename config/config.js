module.exports = {
  
  getHost: function() {
    return '127.0.0.2';
    // return "wss://echo.websocket.org";
  },

  getPort: function() {
    return 8098;
    // return 8080;
  },

  getKrakenHost: function() {
    return 'api.kraken.com';
  },

  getKrakenKey: function() {
    return 'LomwGfnWxqFxtrvaLWPjuhaYgDn59Y9wCuWIkxWSdfchzhSSiKHlxE1a';
  },

  getKrakenSecret: function() {
    return 'gkau2IpE1BYEbJGeEZQWIIS7WwcmkEURJR8rkuy2hx4b44GcY8fXjYAvc4mofYvTcaccunflgzeJz8NMz/R4yA==';
  },

  // No more than 1 request per minute, https://www.kraken.com/help/api#api-call-rate-limit
  getKrakenPollingPeriod: function() {
    return 60;
  },

  getGeminiWebHost: () => {
    return 'https://api.sandbox.gemini.com';
  },

  getGeminiSocketHost: () => {
    return 'wss://api.sandbox.gemini.com';
  },

  getGeminiKey: () => {
    return 'yfHGVoWCzGjDp1F4Kpsf';
  },

  getGeminiSecret: () => {
    return '2u6ap9iypy6qw4ycH7RFWkwfQSDQ';
  },
}
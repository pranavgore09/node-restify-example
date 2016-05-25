// Single logger throughtout application
'use strict';
var bunyan = require('bunyan');
var logger = bunyan.createLogger({
   name: "app_logger",
   streams: [
      {
         level: 'info',
         path: './logs/info.log'
      },
      {
         level: 'error',
         path: './logs/error.log'
      }
   ]
});

module.exports = logger;
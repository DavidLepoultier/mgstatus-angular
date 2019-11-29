'use strict'
var mgstateVersion = require('/opt/apigee/mgstate/package.json').version;
var edgemicroVersion = require('/usr/local/lib/node_modules/edgemicro/package.json').version;
const version = process.version;
const os = require('os');

module.exports = function configureBody (config, created_date, checkProxies, cb) {
  //Uptime
  var seconds = Math.floor((Date.now() - created_date) / 1000 );
  var days = Math.floor(seconds / (3600*24));
  seconds  -= days*3600*24;
  var hrs   = Math.floor(seconds / 3600);
  seconds  -= hrs*3600;
  var mnts = Math.floor(seconds / 60);
  seconds  -= mnts*60;
  var uptime = days+' days, '+hrs+':'+mnts+':'+seconds;

  var pBody = {
    uri: config.mgstatus.uri,
    method: 'POST',
    headers: {
      'x-api-key': config.mgstatus.apiKey,
      'Content-Type': 'application/json'
    },
    rejectUnauthorized: false,
    body: {
      id: process.env.PROJECT_NAME,
      org: process.env.EDGEMICRO_ORG,
      env: process.env.EDGEMICRO_ENV,
      containers:[{
        id: os.hostname(),
        created: created_date,
        configPollInterval: config.edgemicro.config_change_poll_interval,
        checkPushInterval: config.mgstatus.check_poll_interval,
        platform: os.platform(),
        nodejsVersion: version,
        mgstateVersion: mgstateVersion,
        edgemicroVersion: edgemicroVersion,
        loadavg: os.loadavg(),
        memory:{
          total: os.totalmem(),
          used: os.totalmem() -  os.freemem(),
          free: os.freemem()
        },
        time: Date.now(),
        uptime: uptime,
        proxies: checkProxies
      }]
    },
    json: true
  }

  return pBody;
}
var Service, Characteristic;
var http = require('http');

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-viera", "Viera", VIERA);
};

function VIERA(log, config) {
  this.log = log;
  this.name = config.name;
  this.HOST = config.ip;
  this.PORT = config.port;
}

VIERA.prototype.getServices = function () {
  this.informationService = new Service.AccessoryInformation();
  this.informationService.setCharacteristic(
      Characteristic.Manufacturer, "Panasonic");

  this.switchService = new Service.Switch(this.name);
  this.switchService.getCharacteristic(Characteristic.On)
  .on('set', this.setOn.bind(this))
  .on('get', this.getOn.bind(this));

  return [this.switchService, this.informationService];
};

VIERA.prototype.getOn = function (callback) {

  const me = this;
  me.log('Query Power Status on ' + me.HOST + ':' + me.PORT);

};

VIERA.prototype.setOn = function (on, callback) {

  const me = this;
  if (on) {
    me.log("Not Supported");
    return;
  }

  let url, urn;

  url = '/nrc/control_0';
  urn = 'panasonic-com:service:p00NetworkControl:1';

  let body = "<?xml version='1.0' encoding='utf-8'?> \
                <s:Envelope xmlns:s='http://schemas.xmlsoap.org/soap/envelope/' s:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'> \
                  <s:Body> \
                    <u:" + "NRC_POWER-ONOFF" + " xmlns:u='urn:" + urn + "'> \
                    " + "<X_KeyEvent>POWER-ONOFF</X_KeyEvent>" + " \
                    </u:" + "NRC_POWER-ONOFF" + "> \
                  </s:Body> \
                </s:Envelope>";

  let postRequest = {
    host: me.HOST,
    path: url,
    port: 55000,
    method: 'POST',
    headers: {
      'Content-Length': body.length,
      'Content-Type': 'text/xml; charset="utf-8"',
      'SOAPACTION': '"urn:' + urn + '#' + "NRC_POWER-ONOFF" + '"'
    }
  };

  let self = {};
  let req = http.request(postRequest, function (res) {
    res.setEncoding('utf8');
    res.on('data', self.callback);
  });

  req.on('error', function (e) {
    me.log('Error ' + e);
    return false;
  });

  req.write(body);
  req.end();

};

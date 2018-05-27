# Panasonic Viera VT plugin for Homebridge

A very simple Power On/Off Switch for Panasonic VIERA TVs. 

Power On is not supported by all models, unfortunately. 
If your TV does not support Power On while on stand-by, 
Homebridge won't be blocked updating other accessories for more than a second. 

The plugin has as few dependencies as possible.

##### Sample Config:
```json
{
  "accessories": [
    {
      "accessory": "Viera",
      "name": "Living Room TV",
      "description": "Panasonic Viera VT50",
      "ip": "192.168.1.23"
    }
  ]
}
```

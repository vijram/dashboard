# Boodskap Platform Dashboard UI

## API Configuration

 ##### In Config.js file,


 1] change the basePath in the config
 2] change the mqtt url
```sh
 var APP_CONFIG = {
   basePath: '<YOUR API URL>',
     mqtt: {
     hostName: '<MQTT HOST URL>',
       portNo: '<MQTT PORT NO>',
       ssl : <BOOLEAN>
   }
 }
```

 To access boodksap platform api config look like below
 ```sh
 var APP_CONFIG = {
   basePath: 'https://api.boodskap.io',
     mqtt: {
     hostName: 'gw.boodskap.io',
       portNo: 8083,
       ssl : true
   }
 }
```
##### To Enable Console Log
 set DEBUG as true else set DEBUG as false
 ```sh
 var DEBUG = true;
```

License
----

MIT


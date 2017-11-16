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

##### To Enable Console Log
 set DEBUG as true else set DEBUG as false
 ```sh
 var DEBUG = true;
```

License
----

MIT


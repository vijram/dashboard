/*****************************************
 * Booskap Platform Dashboard API Configuration
 * ***************************************

 To connect with your Server
 --------------------------

 1] change the basePath in the config
 2] change the mqtt url

 {
   basePath: '<YOUR API URL>',
     mqtt: {
     hostName: '<MQTT HOST URL>',
       portNo: '<MQTT PORT NO>',
       ssl : <BOOLEAN>
   }
 }


 To access boodksap platform api config look like below
 {
   basePath: 'https://api.boodskap.io',
     mqtt: {
     hostName: 'gw.boodskap.io',
       portNo: 8083,
       ssl : true
   }
 }

 To Enable Console Log set DEBUG as TRUE
 --------------------------

 var DEBUG = true;

 *****************************************/

var APP_CONFIG = {};
var DEBUG = false;

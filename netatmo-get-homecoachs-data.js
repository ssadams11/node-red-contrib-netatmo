/**
 * Copyright 2022 Andreas Huth
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
 module.exports = function(RED)
 {
     "use strict";
     
     function NetatmoGetHomecoachsData(config) {
         const {createNetatmoApifromCredentials} = require('./utils/api-helper');
         
         RED.nodes.createNode(this,config);
         // Retrieve the config node
         this.creds = RED.nodes.getNode(config.creds);
         const node = this;
         this.on('input', function(msg) {
             this.deviceId = msg.deviceId || config.deviceId || '';
 
             const api = createNetatmoApifromCredentials(node);
             if (!api) {
                 return;
             }             
             
             var options = {
             };
 
             // Optional
             if (this.deviceId !== ''){
                 options.device_id = this.deviceId;
             } else {
                options = null; // due to implementaion in netatmo.js
             }

  
             api.getHealthyHomeCoachData(options,function(err, devices) {
                 msg.payload = {devices:devices};
                 node.send(msg);
             });
         });
 
     }
     RED.nodes.registerType("get homecoachs data",NetatmoGetHomecoachsData);
 }
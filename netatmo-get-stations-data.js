/**
 * Copyright 2016 IBM Corp.
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
    
    function NetatmoGetStationsData(config) {

        RED.nodes.createNode(this,config);
        // Retrieve the config node
        this.creds = RED.nodes.getNode(config.creds);
        const node = this;
        this.on('input', function(msg) {
            this.deviceId = msg.deviceId || config.deviceId || '';
            this.getFavorites = msg.getFavorites || config.getFavorites || false;

            const netatmo = require('netatmo');

            const auth = {
                "client_id": this.creds.credentials.client_id,
                "client_secret": this.creds.credentials.client_secret,
                "username": this.creds.credentials.username, 
                "password": this.creds.credentials.password
            };
            const api = new netatmo(auth);
            
            api.on("error", function(error) {
                node.error(error);
            });

            api.on("warning", function(error) {
                node.warn(error);
            });                 
            
            var options = {
            };

            // Optional
            if (this.deviceId !== ''){
                options.device_id = this.deviceId;
            }

            if (this.getFavorites !== false){
                options.get_favorites = this.getFavorites;
            }
 
            api.getStationsData(options,function(err, devices) {
                msg.payload = {devices:devices};
                node.send(msg);
            });
        });

    }
    RED.nodes.registerType("get stations data",NetatmoGetStationsData);
}
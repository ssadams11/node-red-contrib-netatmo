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
 
     function NetatmoHomeStatus(config) {
        const {createNetatmoApifromCredentials} = require('./utils/api-helper');
        
        RED.nodes.createNode(this,config);
        this.creds = RED.nodes.getNode(config.creds);

        var node = this;
        this.on('input', function(msg) {
            this.homeId = msg.homeId || config.homeId || '';
            this.deviceTypes = msg.deviceTypes || config.deviceTypes || '';
			
            const api = createNetatmoApifromCredentials(node);
            if (!api) {
                return;
            }              
            
            var options = {
				'home_id' : this.homeId,
            };

            // Optional
            if (this.deviceTypes !== ''){
                options.deviceTypes = this.deviceTypes;
            }
			
            api.homeStatus(options,function(err, body) {
                msg.payload = body;
                node.send(msg);
            });
        });

    }
    RED.nodes.registerType("home status",NetatmoHomeStatus);
 }
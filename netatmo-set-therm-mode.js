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
    function NetatmoSetThermMode(config) {
        const {createNetatmoApifromCredentials} = require('./utils/api-helper');
        
        RED.nodes.createNode(this,config);
        this.creds = RED.nodes.getNode(config.creds);
        var node = this;
        this.on('input', function(msg) {
            this.homeId = msg.homeId || config.homeId || '';
            this.mode = msg.mode || config.mode || '';
            this.endtime = msg.endtime || config.endtime || '';
			
            const api = createNetatmoApifromCredentials(node);
            if (!api) {
                return;
            }           
            
            var options = {
                home_id : this.homeId,
                mode : this.mode,
            };

            if (this.endtime !== ''){
                if(this.endtime > 1552236804) { // Correction if we got a UNIX Tmestamp
                  options.endtime = Math.floor(this.endtime / 1000);
                }
                else {
                  options.endtime = this.endtime;
                }
            }
			
            api.setThermMode(options);
        });

    }
    RED.nodes.registerType("set therm mode",NetatmoSetThermMode);
}
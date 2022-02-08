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
const mustache = require('mustache');
module.exports = function(RED)
{
    "use strict";

    function NetatmoGetPublicData(config) {
        const {createNetatmoApifromCredentials} = require('./utils/api-helper');
        
        RED.nodes.createNode(this,config);
        this.creds = RED.nodes.getNode(config.creds);
        var node = this;
        this.on('input', function(msg) {
            config.lat_ne = config.lat_ne || '15';
            config.lon_ne = config.lon_ne || '20';
            config.lat_sw = config.lat_sw || '-15';
            config.lon_sw = config.lon_sw || '-20';
            config.required_data = config.required_data || 'rain,humidity';
            config.filter = config.filter || false;
            this.lat_ne = mustache.render(config.lat_ne, msg);
            this.lon_ne = mustache.render(config.lon_ne, msg);
            this.lat_sw = mustache.render(config.lat_sw, msg);
            this.lon_sw = mustache.render(config.lon_sw, msg);
            this.required_data = mustache.render(config.required_data, msg);
            this.filter = mustache.render(config.filter, msg);

            const api = createNetatmoApifromCredentials(node);
            if (!api) {
                return;
            }         
            
            var options = {
                lat_ne: config.lat_ne,
                lon_ne: config.lon_ne,
                lat_sw: config.lat_sw,
                lon_sw: config.lon_sw,
                required_data: config.required_data,
                filter: config.filter,
            };

            api.getPublicData(options,function(err, data) {
                msg.payload = data;
                node.send(msg);
            });
        });
    }
    RED.nodes.registerType("get public data",NetatmoGetPublicData);
}
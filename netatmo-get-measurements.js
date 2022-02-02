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
//@ts-check
/***
 * @typedef {Object} nrNodeExt Extensions for the nodeInstance object type
 * @property {function} [context] get/set context data. Also .flow and .global contexts
 * @property {function} [on] Event listeners for the node instance ('input', 'close')
 * @property {function} [error] Error log output, also logs to the Editor's debug panel
 * @property {function} [send] send a message
 * @property {Object} [creds] credentials 
 */

 const mustache = require('mustache');
 module.exports = function(RED)
 {
    "use strict";
    /**
     * @typedef {(NetatmoGetMeasure & nrNodeExt)} nrNode Combine NetatmoGetMeasure with additional, optional functions
     * @this nrNode 
     */
    
    function NetatmoGetMeasure(config) {
        const {createNetatmoApifromCredentials} = require('./utils/api-helper');

        RED.nodes.createNode(this,config);
        this.creds = RED.nodes.getNode(config.creds);

        var node = this;
        this.on('input', function(msg) {
            config.beginDate = msg.beginDate || config.beginDate || '';
            config.endDate = msg.endDate || config.endDate || '';
            config.limit = config.limit || '';
            config.types = msg.types || config.types || '';
            config.moduleId = msg.moduleId || config.moduleId || '';
            config.deviceId = msg.deviceId || config.deviceId || '';
            this.beginDate = mustache.render(config.beginDate, msg);
            this.endDate = mustache.render(config.endDate, msg);
            this.limit = mustache.render(config.limit, msg);
            this.scale = mustache.render(config.scale, msg);
            this.types = mustache.render(config.types, msg);
            this.moduleId = mustache.render(config.moduleId, msg);
            this.deviceId = mustache.render(config.deviceId, msg);

            const api = createNetatmoApifromCredentials(node);
            if (!api) {
                return;
            }            
            
            var options = {
                device_id: this.deviceId,
                scale: this.scale,
                type: this.types
            };
            if ((this.beginDate !== '')&&(this.beginDate !== null)){
                options.date_begin = JSON.parse(this.beginDate);
            }
            if ((this.endDate !== '')&&(this.endDate !== null)){
                options.date_end = (this.endDate === 'last' ? 'last' : JSON.parse(this.endDate));
            }
            if ((this.limit !== '')&&(this.limit !== null)){
                options.limit = JSON.parse(this.limit);
            }
            if ((this.moduleId !== '')&&(this.moduleId !== null)){
                options.module_id = this.moduleId;
            }

            api.getMeasure(options,function(err, measure) {
                msg.payload = measure;
                node.send(msg);
            });
        });
    }

    RED.nodes.registerType("get measurements",NetatmoGetMeasure);
}
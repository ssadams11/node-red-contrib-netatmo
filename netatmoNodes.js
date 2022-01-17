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
 * @property {function} [warn] log a warning message
 * @property {function} [send] send a message
 * @property {Object} [creds] credentials 
 * 
 */
module.exports = function(RED) {
    "use strict";

    /**
     * @typedef {(NetatmoGetNextEvents & nrNodeExt)} netatmoGetNextEventsNode Combine NetatmoGetNextEventsNode with additional, optional functions
     * @this netatmoGetNextEventsNode 
     */
    function NetatmoGetNextEvents(config) {
        const {createNetatmoApifromCredentials} = require('./utils/api-helper');

        RED.nodes.createNode(this,config);
        this.creds = RED.nodes.getNode(config.creds);
        this.home_id = config.home_id;
        this.event_id = config.event_id;
        var node = this;
        this.on('input', function(msg) {

            const api = createNetatmoApifromCredentials(node);
            if (!api) {
                return;
            }

            var options = {
                home_id: node.home_id,
                event_id: node.event_id
            };
                       
            // Api is marked as deprecated by netatmo
            api.getNextEvents(options, function(err, events) {
                msg.payload = events;
                node.send(msg);
            });
        });

    }
    RED.nodes.registerType("get next events",NetatmoGetNextEvents);

    /**
     * @typedef {(NetatmoGetCameraPicture & nrNodeExt)} netatmoGetCameraPictureNode Combine NetatmoGetCameraPicture with additional, optional functions
     * @this netatmoGetCameraPictureNode 
     */
    function NetatmoGetCameraPicture(config) {
        const {createNetatmoApifromCredentials} = require('./utils/api-helper');

        RED.nodes.createNode(this,config);
        this.creds = RED.nodes.getNode(config.creds);
        this.image_id = config.image_id;
        this.key = config.key;
        var node = this;
        this.on('input', function(msg) {
            
            const api = createNetatmoApifromCredentials(node);
            if (!api) {
                return;
            }            
            
            var options = {
                image_id: node.image_id,
                key: node.key
            };

            // Api is marked as deprecated by netatmo
            api.getCameraPicture(options, function(err, picture) {
                msg.payload = picture;
                node.send(msg);
            });
        });

    }
    RED.nodes.registerType("get camera picture",NetatmoGetCameraPicture);

    /**
     * @typedef {(NetatmoGetHomeData & nrNodeExt)} netatmoGetHomeData Combine NetatmoGetHomeData with additional, optional functions
     * @this netatmoGetHomeData 
     */
    function NetatmoGetHomeData(config) {
        const {createNetatmoApifromCredentials} = require('./utils/api-helper');

        RED.nodes.createNode(this,config);
        this.creds = RED.nodes.getNode(config.creds);
        var node = this;
        this.on('input', function(msg) {

            const api = createNetatmoApifromCredentials(node);
            if (!api) {
                return;
            }              
            
            // Api is marked as deprecated by netatmo
            api.getHomeData(function(err, data) {
                msg.payload = data;
                node.send(msg);
            });
        });

    }
    RED.nodes.registerType("get home data",NetatmoGetHomeData);

    /***************************************************************/
    function NetatmoConfigNode(config) {
        RED.nodes.createNode(this,config);
    }

    RED.nodes.registerType("configNode",NetatmoConfigNode,{
        credentials: {
            client_id: {type:"text"},
            client_secret: {type:"text"},
            username: {type:"text"},
            password: {type:"password"},
    }});

    // Discover homes with homesData
    // see https://github.com/node-red/node-red-nodes/blob/master/hardware/wemo/WeMoNG.html or /node-red-contrib-huemagic/huemagic/hue-brightness.html
    // eslint-disable-next-line no-unused-vars
	RED.httpAdmin.get('/netatmo/homes', function(req, res, next)
	{
        const netatmo = require('netatmo');
        
        const creds = RED.nodes.getNode(req.query.nodeIdCred);
        if (!creds) {
            res.end(JSON.stringify({error:'No configuration node found.'}));
            return;
        }

        const credentials = creds.credentials;
        if (!credentials) {
            res.end(JSON.stringify({error:'No configuration found.'}));
            return;
        }

        const auth = {
            client_id: credentials.client_id,
            client_secret: credentials.client_secret,
            username: credentials.username, 
            password: credentials.password,
            "scope": '' // TODO: scope aus credentials befüllen
        };

        try { // falls der Constructor schief geht
            const api = new netatmo(auth);
            // @ts-ignore
            api.on("error", function(error) {
                res.end(JSON.stringify({error:error.message}));
            });
            // @ts-ignore
            api.on("warning", function(error) {
                res.end(JSON.stringify({error:error.message}));
            });

            const options = {};
            api.homesData(options,function(err, body) {
                res.end(JSON.stringify(body));
            });
        } catch(error) {
            res.end(JSON.stringify({error:error.message}));
        }
	});   
};

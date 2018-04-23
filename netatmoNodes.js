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
mustache = require('mustache');
module.exports = function(RED) {
    "use strict";

    /***************************************************************/
    function NetatmoGetNextEvents(config) {

        RED.nodes.createNode(this,config);
        this.creds = RED.nodes.getNode(config.creds);
        this.home_id = config.home_id;
        this.event_id = config.event_id;
        var node = this;
        this.on('input', function(msg) {
            var netatmo = require('netatmo');

            var auth = {
                "client_id": this.creds.client_id, //"56e984c449c75fc1598b45c4",
                "client_secret": this.creds.client_secret, //"X4l1Ct9GKPtlTjDC6piX2RAsKKe",
                "username": this.creds.username,  
                "password": this.creds.password  
            };
            var api = new netatmo(auth);
            var options = {
                home_id: node.home_id,
                event_id: node.event_id
            };
            
            api.on("error", function(error) {
                node.error(error);
            });

            api.on("warning", function(error) {
                node.warn(error);
            });            
            
            api.getNextEvents(options, function(err, events) {
                msg.payload = events;
                node.send(msg);
            });
        });

    }
    RED.nodes.registerType("get next events",NetatmoGetNextEvents);
    /***************************************************************/
    function NetatmoGetCameraPicture(config) {

        RED.nodes.createNode(this,config);
        this.creds = RED.nodes.getNode(config.creds);
        this.image_id = config.image_id;
        this.key = config.key;
        var node = this;
        this.on('input', function(msg) {
            var netatmo = require('netatmo');

            var auth = {
                "client_id": this.creds.client_id, //"56e984c449c75fc1598b45c4",
                "client_secret": this.creds.client_secret, //"X4l1Ct9GKPtlTjDC6piX2RAsKKe",
                "username": this.creds.username,  
                "password": this.creds.password  
            };
            var api = new netatmo(auth);
            
            api.on("error", function(error) {
                node.error(error);
            });

            api.on("warning", function(error) {
                node.warn(error);
            });                 
            
            var options = {
                image_id: node.image_id,
                key: node.key
            };

            api.getCameraPicture(options, function(err, picture) {
                msg.payload = picture;
                node.send(msg);
            });
        });

    }
    RED.nodes.registerType("get camera picture",NetatmoGetCameraPicture);
    /***************************************************************/
    function NetatmoGetHomeData(config) {

        RED.nodes.createNode(this,config);
        this.creds = RED.nodes.getNode(config.creds);
        var node = this;
        this.on('input', function(msg) {
            var netatmo = require('netatmo');

            var auth = {
                "client_id": this.creds.client_id, //"56e984c449c75fc1598b45c4",
                "client_secret": this.creds.client_secret, //"X4l1Ct9GKPtlTjDC6piX2RAsKKe",
                "username": this.creds.username,  
                "password": this.creds.password  
            };
            var api = new netatmo(auth);
            
            api.on("error", function(error) {
                node.error(error);
            });

            api.on("warning", function(error) {
                node.warn(error);
            });                 
            
            api.getHomeData(function(err, data) {
                msg.payload = data;
                node.send(msg);
            });
        });

    }
    RED.nodes.registerType("get home data",NetatmoGetHomeData);
   /***************************************************************/
    function NetatmoGetMeasure(config) {

        RED.nodes.createNode(this,config);
        this.creds = RED.nodes.getNode(config.creds);
        var node = this;
        this.on('input', function(msg) {
            config.beginDate = msg.beginDate || config.beginDate || '';
            config.endDate = msg.endDate || config.endDate || '';
            config.limit = config.limit || '';
            config.types = msg.types || config.types || '';
            config.moduleId = msg.moduleId || config.moduleId || '';
            this.beginDate = mustache.render(config.beginDate, msg);
            this.endDate = mustache.render(config.endDate, msg);
            this.limit = mustache.render(config.limit, msg);
            this.scale = mustache.render(config.scale, msg);
            this.types = mustache.render(config.types, msg);
            this.moduleId = mustache.render(config.moduleId, msg);
            var netatmo = require('netatmo');

            var auth = {
                "client_id": this.creds.client_id,
                "client_secret": this.creds.client_secret,
                "username": this.creds.username,
                "password": this.creds.password
            };
            var api = new netatmo(auth);
            
            api.on("error", function(error) {
                node.error(error);
            });

            api.on("warning", function(error) {
                node.warn(error);
            });                 
            
            var options = {
                device_id: this.creds.device_id,
                scale: config.scale,
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
    /***************************************************************/
    function NetatmoGetStationsData(config) {

        RED.nodes.createNode(this,config);
        this.creds = RED.nodes.getNode(config.creds);
        var node = this;
        this.on('input', function(msg) {
            var netatmo = require('netatmo');

            var auth = {
                "client_id": this.creds.client_id,
                "client_secret": this.creds.client_secret,
                "username": this.creds.username, 
                "password": this.creds.password
            };
            var api = new netatmo(auth);
            
            api.on("error", function(error) {
                node.error(error);
            });

            api.on("warning", function(error) {
                node.warn(error);
            });                 
            
            api.getStationsData(function(err, devices) {
                msg.payload = {devices:devices};
                node.send(msg);
            });
        });

    }
    RED.nodes.registerType("get stations data",NetatmoGetStationsData);
    /***************************************************************/
    function NetatmoGetPublicData(config) {
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
            var netatmo = require('netatmo');

            var auth = {
                "client_id": this.creds.client_id,
                "client_secret": this.creds.client_secret,
                "username": this.creds.username,
                "password": this.creds.password 
            };
            var api = new netatmo(auth);
            
            api.on("error", function(error) {
                node.error(error);
            });

            api.on("warning", function(error) {
                node.warn(error);
            });                 
            
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
    /***************************************************************/
    function NetatmoConfigNode(n) {
        RED.nodes.createNode(this,n);
        this.client_id = n.client_id;
        this.client_secret = n.client_secret;
        this.username = n.username;
        this.password = n.password;
        this.device_id = n.device_id;
    }
    RED.nodes.registerType("configNode",NetatmoConfigNode);

};

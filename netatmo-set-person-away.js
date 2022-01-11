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

    function NetatmoSetPersonAway(config) {
        RED.nodes.createNode(this, config);
        this.creds = RED.nodes.getNode(config.creds);
        this.homeId = config.homeId || config.home_id || '';
        this.personId = config.personId || config.person_id || '';
        var node = this;
        this.on('input', function (msg) {
            const netatmo = require('netatmo');

            const auth = {
                "client_id": this.creds.credentials.client_id,
                "client_secret": this.creds.credentials.client_secret,
                "username": this.creds.credentials.username, 
                "password": this.creds.credentials.password
            };
            const api = new netatmo(auth);
            var options = {
                home_id: node.homeId,
                person_id: node.personId
            };

            if (msg && msg.payload) {
                // use home id from msg payload
                if (msg.payload.home_id) {
                    options.home_id = msg.payload.home_id;
                }
                if (msg.payload.homeId) {
                    options.home_id = msg.payload.homeId;
                }
                // use person_id id from msg payload
                if (msg.payload.person_id) {
                    options.person_id = msg.payload.person_id;
                }
                if (msg.payload.personId) {
                    options.person_id = msg.payload.personId;
                }
            }

            api.on("error", function (error) {
                node.error(error);
            });

            api.on("warning", function (error) {
                node.warn(error);
            });

            api.setPersonAway(options, function (err, events) {
                msg.payload = events;
                node.send(msg);
            });
        });
    }
    RED.nodes.registerType("set person away",NetatmoSetPersonAway);
} 
    
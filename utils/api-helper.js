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
//@ts-check
/***
 * @module utils/api-helper
 *
 * @typedef {Object} nrNodeExt Extensions for the nodeInstance object type
 * @property {function} [context] get/set context data. Also .flow and .global contexts
 * @property {function} [on] Event listeners for the node instance ('input', 'close')
 * @property {function} [error] Error log output, also logs to the Editor's debug panel
 * @property {function} [warn] log a warning message
 * @property {function} [send] send a message
 * @property {Object} [creds] credentials 
 * 
 */
"use strict";

module.exports = {
	/**
     * @param {nrNodeExt} node the configuration nnode
     * @return {netatmo} netatmo api.
	 */
     createNetatmoApifromCredentials: function (node) {
        if (!node) {
            node.error('internal Error: node is undefined.');
            return null;        }

        const credentials = node.creds.credentials

        if (!credentials) {
            node.error('internal Error: credentials is undefined.');
            return null;
        }

        const auth = {
            "client_id": credentials.client_id,
            "client_secret": credentials.client_secret,
            "username": credentials.username, 
            "password": credentials.password,
            "scope": credentials.scope,
            "user_prefix": credentials.user_prefix,
        };

        const netatmo = require('netatmo');
            try { // falls der Constructor schief geht
            const api = new netatmo(auth);

            // @ts-ignore
            api.on("error", function(error) {
                node.error(error);
            });

            // @ts-ignore
            api.on("warning", function(error) {
                node.warn(error);
            });

            return api;
        } catch(error) {
            node.error('Please check the netatmo configuration node: '+error.message);
            return null;
        }
	}
}

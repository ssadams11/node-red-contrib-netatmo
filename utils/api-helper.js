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

"use strict";

module.exports = {
	/**
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
            "scope": '' // TODO: scope aus credentials befüllen
        };

        const netatmo = require('netatmo');
            try { // falls der Constructor schief geht
            const api = new netatmo(auth);

            api.on("error", function(error) {
                node.error(error);
            });

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

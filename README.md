# node-red-contrib-netatmo

Provides a few nodes to connect to Netatmo devices.
See [here](https://dev.netatmo.com/apidocumentation) for details

## Installation

    npm install node-red-contrib-netatmo -g

Get Measurements node now supports mustache for arguments: {{payload.something}}

## Details

Version 0.3.1: add support for velux active with netatmo devices

Please check 'velux active with netatmo' in configuration node.

With Version 0.3.0 the behavior of the configuration nodes has been changed:

You must reenter your Netatmo account information on the configuration node page. The “default” device ID has been removed from the configuration node. You have to enter it in the specific nodes "get measurements" or in the input message in field msg.deviceId.

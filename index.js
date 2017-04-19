/*jslint node: true */
"use strict";

var _ = require('lodash'),
    plantumlify = require("./lib/plantumlify");

var input = require('./data/customerformdata.json');

plantumlify(input)
    .then(console.log)
    .catch(console.log);
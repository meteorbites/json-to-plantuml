#!/usr/bin/env node
var _ = require("lodash"),
    plantumlify = require("../lib/plantumlify"),
    byline = require('byline'),
    fs = require('fs'),
    request = require('request'),
    argv = require('minimist')(process.argv.slice(2));

function jsonToPlantuml(jsonData) {
    plantumlify(jsonData)
        .then(console.log)
        .catch(console.log);
}

if (process.stdin.isTTY) {
    // handle shell arguments
    var filepath = argv._[0] || argv.f;
    var url = argv.u;

    if (filepath != undefined) {
        fs.readFile(filepath, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            jsonToPlantuml(data);
        });
    }
    else if (url != undefined) {
        request(url, function (err, response, data) {
            if (!error && response.statusCode == 200) {
                jsonToPlantuml(data);
            } else {
                return console.log(err);
            }
        })
    }
    else {
        printHelp();
        process.exit();
    }
} else {
    // handle piped content 
    var input = [];
    var stream = byline(process.stdin);
    stream.on("data", function (line) {
        input.push(line + "");
    }).on("end", function () {
        jsonToPlantuml(input.join("\n"));
    });
}

function printHelp() {
    console.log(`
Usage:
    json-to-plantuml [filepath|-f filepath|-u filepath]
    json-to-plantuml <filepath>

Options:
  -f  <filepath>   Transforms JSON to Plant UML text.
  -u  <url>        Transforms JSON to Plant UML text
  -h               Displays this help

  json-to-plantuml -f albumdata.json

Note:
   json-to-plantuml also supports pipe in data.
   e.g. echo '{"foo": "bar"}' | json-to-plantuml`);
}
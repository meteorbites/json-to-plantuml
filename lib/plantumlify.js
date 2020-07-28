/*jslint node: true */
var _ = require('lodash'),
    Handlebars = require('handlebars'),
    template = Handlebars.compile(`
@startuml
{{#each newObj}}
class "{{clsName}}" as {{clsNameFullReference}} {
    .. Properties ..
    {{#each clsProperties}}
    {{.}}
    {{/each}}
    {{~#if clsObjects}}
    .. Objects ..
    {{#each clsObjects}}
    {{.}}
    {{/each}}  
    {{~/if~}}
}
{{/each}}
{{#each objRelations}}
{{.}}
{{/each}}
@enduml
`);


function splitter_(str, maxLength, suffix) {

    str = str.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\t/g, "    ");
//    \r\n -> \n
//    \r   -> \n
//    \t   -> "    "

    var pointer = 0;
    var inChunk;
    var outChunk;
    var newLinePointer;
    var lastSpacePointer;
    var outChunks = [];

    while (pointer < str.length) {
        inChunk = str.substr(pointer, maxLength);

        newLinePointer = inChunk.indexOf("\n");

        if (newLinePointer !== -1) {
            outChunk = inChunk.substring(0, newLinePointer);
            pointer += newLinePointer + 1;
        } else {
            if (inChunk.length === maxLength) {

                lastSpacePointer = inChunk.lastIndexOf(" ");

                if (lastSpacePointer !== -1) {
                    outChunk = inChunk.substring(0, lastSpacePointer + 1);
                    pointer += lastSpacePointer + 1;
                } else {
                    outChunk = inChunk;
                    pointer += inChunk.length;
                }
            } else {
                outChunk = inChunk;
                pointer += inChunk.length;
            }
        }
	outChunks.push(outChunk);
    }

    return outChunks.join(suffix);
}

function prepareForPlantuml(str) {
//	prepares a string (that may have special symbols that plantuml does not like in names)
//	for use in plantuml statements.
//	For example, a -- a.<b> will result in error, so < and > needs to be replaced
//	Spaces are not honored by Plantuml, so, need to be replaced too.

	return str.replace(/\s/g, "_").replace(/\</g, "_lt_").replace(/\>/g, "_gt_");
}

function traverse(obj, ignore_list, parent) {
    var maxWidth = 32;
    var splittingStr = "\\n";
    var newObj = [];
    var objRelations = [];
    // Get Object keys of obj
    Object.keys(obj)
        // Iterate on Keys 
        .forEach(function (key) {

            // check obj(key) if Object
            if (_.isObject(obj[key])) {
                // classify all properties of obj(key) for primitives and objects
                var objProperties = [];
                var objChildObjects = {};
                var objChildObjectsStr = [];

                _.each(obj[key], function (objVal, objKey) {
                    if (_.isObject(obj[key][objKey])) {
                        objChildObjectsStr.push( splitter_(`${objKey}: ${_.isArray(obj[key][objKey]) ? "[Array]" : objVal}`, maxWidth, splittingStr) );
                        objChildObjects[objKey] = obj[key][objKey];
                    } else {
                        objProperties.push( splitter_(`${objKey}: ${objVal}`, maxWidth, splittingStr) );
                    }
                });

                newObj.push({
                    clsName: key,
                    clsNameFullReference: prepareForPlantuml(key),
                    clsProperties: objProperties,
                    clsObjects: objChildObjectsStr
                });

                if (!_.isEmpty(objChildObjects) && !(ignore_list.includes(key))) {
                    var tmp = traverse(objChildObjects, ignore_list, (parent != undefined ? `${parent}.${key}` : key));

                    tmp.objRelations.forEach(function (rel, index) {
                        objRelations.push(rel);
                    });
                    tmp.newObj.forEach(function (clsItem, index) {
                        clsItem.clsNameFullReference = `${prepareForPlantuml(key)}.${prepareForPlantuml(clsItem.clsNameFullReference)}`;
                        newObj.push(clsItem);
                    });
                    // Get Object keys of objChildObjects[objKey] to establish relations
                    Object.keys(objChildObjects)
                        .forEach(function (objChildObjectKey) {
                            if (parent) {
                                objRelations.push(`${prepareForPlantuml(parent)}.${prepareForPlantuml(key)} -- ${prepareForPlantuml(parent)}.${prepareForPlantuml(key)}.${prepareForPlantuml(objChildObjectKey)}`);
                            } else {
                                objRelations.push(`${prepareForPlantuml(key)} -- ${prepareForPlantuml(key)}.${prepareForPlantuml(objChildObjectKey)}`);
                            }
                        });
                }
            }
        });

    // new data representation for the json input that we will feed to our template...
    return {
        newObj,
        objRelations
    }
}

module.exports = function (input, ignore_list) {

    return new Promise(function (resolve, reject) {
        var json;

        if (!_.isObject(input) && _.isString(input)) {
            try {
                json = JSON.parse(input);
            }
            catch (e) {
                reject(new Error('Unable to parse input!!!'));
            }
        } else {
            json = input;
        }

        if (Object.keys(json)
            .some(function (key) {
                return !_.isObject(json[key]);
            })) {
            /*wrapping with root to accomodate input that has multiple keys that aren't objects */
            json = { "root": json };
        };

        resolve(template(traverse(json, ignore_list)));
    });
};
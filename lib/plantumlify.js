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

function prepareKey(key) {
	return key.replace(/\s/g, "_").replace(/\</g, "_lt_").replace(/\>/g, "_gt_");
}

function traverse(obj, parent) {
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
                        objChildObjectsStr.push(`${objKey}: ${_.isArray(obj[key][objKey]) ? "[Array]" : objVal}`);
                        objChildObjects[objKey] = obj[key][objKey];
                    } else {
                        objProperties.push(`${objKey}: ${objVal}`);
                    }
                });

                newObj.push({
                    clsName: key,
                    clsNameFullReference: prepareKey(key),
                    clsProperties: objProperties,
                    clsObjects: objChildObjectsStr
                });

                if (!_.isEmpty(objChildObjects)) {
                    var tmp = traverse(objChildObjects, (parent != undefined ? `${parent}.${key}` : key));

                    tmp.objRelations.forEach(function (rel, index) {
                        objRelations.push(rel);
                    });
                    tmp.newObj.forEach(function (clsItem, index) {
                        clsItem.clsNameFullReference = `${key}.${clsItem.clsNameFullReference}`;
                        newObj.push(clsItem);
                    });
                    // Get Object keys of objChildObjects[objKey] to establish relations
                    Object.keys(objChildObjects)
                        .forEach(function (objChildObjectKey) {
                            if (parent) {
                                objRelations.push(`${parent}.${key} -- ${parent}.${key}.${prepareKey(objChildObjectKey)}`);
                            } else {
                                objRelations.push(`${key} -- ${key}.${prepareKey(objChildObjectKey)}`);
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

module.exports = function (input) {

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

        resolve(template(traverse(json)));
    });
};
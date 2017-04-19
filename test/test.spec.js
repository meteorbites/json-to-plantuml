var plantumlify = require("../lib/plantumlify");
var assert = require('assert');

describe('JSON to Plant UML', function () {
    describe('#plantumlify() Test Case 1 - Customer Form Data', function () {
        it('should match', function () {

            var jsonInput = require('../data/customerformdata.json');
            var strExpected = `
@startuml
class "root" as root {
    .. Properties ..
    firstName: John
    lastName: Smith
    age: 25
    .. Objects ..
    address: [object Object]
    phoneNumber: [Array]
}
class "address" as root.address {
    .. Properties ..
    streetAddress: 21 2nd Street
    city: New York
    state: NY
    postalCode: 10021
}
class "phoneNumber" as root.phoneNumber {
    .. Properties ..
    .. Objects ..
    0: [object Object]
    1: [object Object]
}
class "0" as root.phoneNumber.0 {
    .. Properties ..
    type: home
    number: 212 555-1234
}
class "1" as root.phoneNumber.1 {
    .. Properties ..
    type: fax
    number: 646 555-4567
}
root.phoneNumber -- root.phoneNumber.0
root.phoneNumber -- root.phoneNumber.1
root -- root.address
root -- root.phoneNumber
@enduml
`

            return plantumlify(jsonInput)
                .then(function (result) {
                    assert.equal(result, strExpected)
                })
        });
    });

    describe('#plantumlify() Test Case 2 - Colors Data', function () {
        it('should match', function () {

            var jsonInput = require('../data/colorsdata.json');

            var strExpected = `
@startuml
class "colorsArray" as colorsArray {
    .. Properties ..
    .. Objects ..
    0: [object Object]
    1: [object Object]
    2: [object Object]
    3: [object Object]
    4: [object Object]
    5: [object Object]
    6: [object Object]
}
class "0" as colorsArray.0 {
    .. Properties ..
    colorName: red
    hexValue: #f00
}
class "1" as colorsArray.1 {
    .. Properties ..
    colorName: green
    hexValue: #0f0
}
class "2" as colorsArray.2 {
    .. Properties ..
    colorName: blue
    hexValue: #00f
}
class "3" as colorsArray.3 {
    .. Properties ..
    colorName: cyan
    hexValue: #0ff
}
class "4" as colorsArray.4 {
    .. Properties ..
    colorName: magenta
    hexValue: #f0f
}
class "5" as colorsArray.5 {
    .. Properties ..
    colorName: yellow
    hexValue: #ff0
}
class "6" as colorsArray.6 {
    .. Properties ..
    colorName: black
    hexValue: #000
}
colorsArray -- colorsArray.0
colorsArray -- colorsArray.1
colorsArray -- colorsArray.2
colorsArray -- colorsArray.3
colorsArray -- colorsArray.4
colorsArray -- colorsArray.5
colorsArray -- colorsArray.6
@enduml
`;

            return plantumlify(jsonInput)
                .then(function (result) {
                    assert.equal(result, strExpected)
                })
        });
    });

    describe('#plantumlify() Test Case 3 - Products Data', function () {
        it('should match', function () {

            var jsonInput = require('../data/productdatabase.json');

            var strExpected = `
@startuml
class "root" as root {
    .. Properties ..
    name: Product
    .. Objects ..
    properties: [object Object]
}
class "properties" as root.properties {
    .. Properties ..
    .. Objects ..
    id: [object Object]
    name: [object Object]
    price: [object Object]
    tags: [object Object]
}
class "id" as root.properties.id {
    .. Properties ..
    type: number
    description: Product identifier
    required: true
}
class "name" as root.properties.name {
    .. Properties ..
    description: Name of the product
    type: string
    required: true
}
class "price" as root.properties.price {
    .. Properties ..
    type: number
    minimum: 0
    required: true
}
class "tags" as root.properties.tags {
    .. Properties ..
    type: array
    .. Objects ..
    items: [object Object]
}
class "items" as root.properties.tags.items {
    .. Properties ..
    type: string
}
root.properties.tags -- root.properties.tags.items
root.properties -- root.properties.id
root.properties -- root.properties.name
root.properties -- root.properties.price
root.properties -- root.properties.tags
root -- root.properties
@enduml
`;

            return plantumlify(jsonInput)
                .then(function (result) {
                    assert.equal(result, strExpected)
                })
        });
    });

    describe('#plantumlify() Test Case 4 - Album Data', function () {
        it('should match', function () {

            var jsonInput = require('../data/albumdata.json');
            var strExpected = `
@startuml
class "album" as album {
    .. Properties ..
    name: The Dark Side of the Moon
    artist: Pink Floyd
    year: 1973
    .. Objects ..
    tracks: [Array]
}
class "tracks" as album.tracks {
    .. Properties ..
    0: Speak To Me
    1: Breathe
    2: On The Run
}
album -- album.tracks
@enduml
`

            return plantumlify(jsonInput)
                .then(function (result) {
                    assert.equal(result, strExpected)
                })
        });
    });

    describe('#plantumlify() Test Case 5 - Facebook Data', function () {
        it('should match', function () {

            var jsonInput = require('../data/facebookdata.json');
            var strExpected = `
@startuml
class "data" as data {
    .. Properties ..
    .. Objects ..
    0: [object Object]
    1: [object Object]
}
class "0" as data.0 {
    .. Properties ..
    id: X999_Y999
    message: Looking forward to 2010!
    type: status
    created_time: 2010-08-02T21:27:44+0000
    updated_time: 2010-08-02T21:27:44+0000
    .. Objects ..
    from: [object Object]
    actions: [Array]
}
class "from" as data.0.from {
    .. Properties ..
    name: Tom Brady
    id: X12
}
class "actions" as data.0.actions {
    .. Properties ..
    .. Objects ..
    0: [object Object]
    1: [object Object]
}
class "0" as data.0.actions.0 {
    .. Properties ..
    name: Comment
    link: http://www.facebook.com/X999/posts/Y999
}
class "1" as data.0.actions.1 {
    .. Properties ..
    name: Like
    link: http://www.facebook.com/X999/posts/Y999
}
class "1" as data.1 {
    .. Properties ..
    id: X998_Y998
    message: Where&#x27;s my contract?
    type: status
    created_time: 2010-08-02T21:27:44+0000
    updated_time: 2010-08-02T21:27:44+0000
    .. Objects ..
    from: [object Object]
    actions: [Array]
}
class "from" as data.1.from {
    .. Properties ..
    name: Peyton Manning
    id: X18
}
class "actions" as data.1.actions {
    .. Properties ..
    .. Objects ..
    0: [object Object]
    1: [object Object]
}
class "0" as data.1.actions.0 {
    .. Properties ..
    name: Comment
    link: http://www.facebook.com/X998/posts/Y998
}
class "1" as data.1.actions.1 {
    .. Properties ..
    name: Like
    link: http://www.facebook.com/X998/posts/Y998
}
data.0.actions -- data.0.actions.0
data.0.actions -- data.0.actions.1
data.0 -- data.0.from
data.0 -- data.0.actions
data.1.actions -- data.1.actions.0
data.1.actions -- data.1.actions.1
data.1 -- data.1.from
data.1 -- data.1.actions
data -- data.0
data -- data.1
@enduml
`

            return plantumlify(jsonInput)
                .then(function (result) {
                    assert.equal(result, strExpected)
                })
        });
    });
});
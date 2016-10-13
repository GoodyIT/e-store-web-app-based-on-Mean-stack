var config = require = ('../config');
var easypost = require('node-easypost')(config.EASYPOST_KEY);

/***********************************
 * shippingData Object =>
 * 
 * fromAddress: {} merchant address
 * toAddress: {} customer address
 * ==> name: string
 * ==> street1: string
 * ==> street2: string
 * ==> city: string
 * ==> state: string
 * ==> zip: string
 * ==> country: string
 * ==> phone: string
 * 
 * parcel: {} parcel info 
 * ==> length: inches
 * ==> width: inches
 * ==> height: inches
 * ==> weight: OUNCES
 * 
 ***********************************/


/**
 * create, verify and return Address Object
 * return error or address Object with ID
 */
function verifyAddress(address) {
    return new Promise((resolve, reject) => {
        
        easypost.Address.create(address, function (err, resAddress) {
            resAddress.verify(function (err, response) {
                if (err) {
                    reject('Address is invalid');
                }
                else {
                    resolve(response.address);
                }
            });
        });
    
    });
}


/**
 * create parcel 
 * return error or Parcel Object with ID
 */
function createParcel(dimensions, definedPackage) {
    return new Promise((resolve, reject) => {

        if (definedPackage) {
            easypost.Parcel.create(
                { 
                    predefined_package: definedPackage,
                    weight: dimensions.weight
                },
                function (err, response) {
                    if (err) return reject(err);
                    resolve(shortParcel(response));
                } 
            );
        }
        else {
            easypost.Parcel.create(dimensions, function (err, response) {
                if (err) return reject(err);
                resolve(shortParcel(response));
            });
        }

    });
}

function shortParcel(parcelObject) {
    return {
        id: parcelObject.id,
        length: parcelObject.length,
        width: parcelObject.width,
        height: parcelObject.height,
        weight: parcelObject.weight
    };
}

/**
 * create shipment to get rates by passing all needed IDs
 * return error or shipment Object with ID
 */
function createShipment(fromAddress, toAddress, parcel) {
    return new Promise((resolve, reject) => {

        // retrieve objects

        var shipmentInfo = { 
            from_address: { id: fromAddress, object: 'Address' },
            to_address: { id: toAddress, object: 'Address' },
            parcel: { id: parcel, object: 'Parcel' }
        };

        easypost.Shipment.create(shipmentInfo, function (err, shipment) {
            if (err) return reject(err);
            resolve(shipment);
        });

    });
}

/**
 * retrieve shipment by id
 */
function retrieveShipment(id) {
    return new Promise((resolve, reject) => {

        easypost.Shipment.retrieve(id, function (err, shipment) {
            if (err) return reject(err);
            resolve(shipment);
        });

    });
}

/**
 * buy shipment by shipment id and rate id
 * return error or shipment object with (tracking_code & postage_label.label_url)
 */
function buyShipment(shipment, rate) {
    return new Promise((resolve, reject) => {
        // retrieve shipment than buy it
        retrieveShipment(shipment).then(res => {
            // buy returned shipment
            res.buy({ rate: { id: rate, object: 'Rate' } }, function (err, response) {
                if (err) return reject(err);
                resolve(response);
            });
        })
        // catch error retrieving shipment
        .catch(err => reject(err));

    });
}
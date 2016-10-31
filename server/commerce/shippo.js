var config = require('../config');
var error = require('./error');
var shippo = require('shippo')(config.COMMERCE.SHIPPO_KEY);


// shipment constructor
function Shipment () {
    
    // local variables
    this.shipment = {
        addressFrom: {},
        addressTo: {},
        parcel: {},
        selectedRate: '',
        tracking: {}
    };

}

// create a new shipment 
function create (addressFrom, addressTo, parcel) {
    
    var that = this;
    
    return new Promise((resolve, reject) => {

        // parameters check
        var paramCheck = true;
        paramCheck = ( paramCheck && addressFrom );
        paramCheck = ( paramCheck && addressTo );
        paramCheck = ( paramCheck && parcel );

        // reject on param error
        if (!paramCheck) {
            return reject(new Error(error.PARAMS_NOT_FOUND));
        }

        // init addresses
        addressTo.object_purpose = "PURCHASE";
        addressFrom.object_purpose = "PURCHASE";

        // create shipment on shippo
        shippo.shipment.create({
            "object_purpose": "PURCHASE",
            "address_from": addressFrom,
            "address_to": addressTo,
            "parcel": parcel,
            "async": false
        }, function (err, shipment) {
            if (err) return reject(err);

            // init local shipment data
            that.shipment = shortShipment(shipment);

            // set shipment info
            that.shipment.addressFrom = addressFrom;
            that.shipment.addressTo = addressTo;
            that.shipment.parcel = parcel;

            // return it back to user
            resolve(that.shipment);
 
        });

    });

}

// shippo.shipment.retrieve
function retrieve (shipmentId) {

    var that = this;

    return new Promise((resolve, reject) => {

        // parameters check
        if (!shipmentId) return reject(new Error(error.PARAMS_NOT_FOUND));

        shippo.shipment.retrieve(shipmentId, function (err, shipment) {
            if (err) {
                return reject(err);
            }
            
            that.shipment = shortShipment(shipment);
            resolve(that.shipment);
        });

    });

}

// buy shipment and get label
function buy (rateId) {

    var that = this;
    
    return new Promise((resolve, reject) => {

        // parameters check
        if (!rateId) return reject(new Error(error.PARAMS_NOT_FOUND));

        that.shipment.selectedRate = rateId;

        // Purchase the desired rate.
        shippo.transaction.create({
            "rate": rateId,
            "label_file_type": "PDF",
            "async": false
        }, function (err, transaction) {
            if (err) return reject(err);

            that.shipment.tracking = {
                trackingNumber: transaction.tracking_number,
                trackingStatus: transaction.tracking_status,
                trackingHistory: transaction.tracking_history,
                trackingUrl: transaction.tracking_url_provider,
                labelUrl: transaction.label_url
            };

            resolve(that.shipment.tracking);
        });

    });
}


/** PRIVATE METHODS */

/**
 * this function takes shippo shipment
 * and remove unnecessarily properties 
 */
function shortShipment (shipment) {

    var rates = [];
    for (var i = 0; i < shipment.rates_list.length; i++) {
        var rate = shipment.rates_list[i];
        rates.push({
            id: rate.object_id,
            amount: rate.amount,
            currency: rate.currency,
            provider: rate.provider,
            providerImage75: rate.provider_image_75,
            providerImage200: rate.provider_image_200,
            serviceLevelName: rate.servicelevel_name,
            days: rate.days,
            durationTerms: rate.duration_terms
        });
    }

    var myShipment = {
        info: {
            id: shipment.object_id,
            state: shipment.object_state,
            status: shipment.object_status
        },
        rates: rates
    };

    return myShipment;

}


/** MODULE SETUP */

// add shipment methods to the constructor
Shipment.prototype.create = create;
Shipment.prototype.buy = buy;
Shipment.prototype.retrieve = retrieve;

module.exports = Shipment;
'use strict';

var stripe = require('./stripe'); 


/**
 * @description charge Customer for the given order.
 * @argument {object} orderData given order data to charge for.
 * @return {Promise} return promise with either success result or error message.
 */
function charge (orderData) {
    return new Promise((resolve, reject) => {

        // validate given parameters.
        if(!validateParams(orderData)) {
            var err = new Error('argument exception in charge function');
            reject(err);
        }

        // select charging method
        var chargeMethod = selectChargeMethod(orderData.payment.method);

        // assert that the payment method exist
        if (!chargeMethod) return reject(new Error('payment method not found while trying to charge!'));

        // proceed to charge.
        chargeMethod.charge(orderData)
            .then((chargeId) => resolve(res))  // return charge id
            .catch((err) => reject(err));

    });
}

/**
 * @description refund charges to client with selected payment method
 * @argument {string} chargeId charging id
 * @argument {string} method charging method
 * @return {Promise} either error or resolve refund result
 */
function refund (chargeId, method) {
    return new Promise((resolve, reject) => {

        // select charging method
        var chargeMethod = selectChargeMethod(method);

        // assert that the payment method exist
        if (!chargeMethod) return reject(new Error('payment method not found, while trying to refund customer!'));

        // refund charges to user 
        chargeMethod.refund(chargeId)
            .then((refundInfo) => resolve(refundInfo))   // return refund process info.
            .catch((err) => reject(err));

    });
}

/**
 * @description verifying passed order
 * data to charge function.
 * @argument {object} orderData given order data to charge for
 * @return {boolean} true if all params exist. 
 */
function validateParams (orderData) {
/**
 * OrderData Structure
 * 
 * > payment        {object}
 * >> method        {string} enum: 'stripe'
 * >> cardToken     {string}
 * >> amount        {number}
 * 
 * > cutomerInfo    {object}
 * >> name          {string}
 * >> phone         {string}
 * >> email         {string}
 * >> address       {string}
 * 
 * > orderId        {string}
 */

    var paramCheck = true;
    paramCheck = ( paramCheck && orderData );
    paramCheck = ( paramCheck && orderData.payment );
    paramCheck = ( paramCheck && orderData.payment.method );
    paramCheck = ( paramCheck && orderData.payment.cardToken );
    paramCheck = ( paramCheck && orderData.payment.amount );
    paramCheck = ( paramCheck && orderData.customerInfo );
    paramCheck = ( paramCheck && orderData.customerInfo.name );
    paramCheck = ( paramCheck && orderData.customerInfo.phone );
    paramCheck = ( paramCheck && orderData.customerInfo.email );
    paramCheck = ( paramCheck && orderData.customerInfo.address );
    paramCheck = ( paramCheck && orderData.orderId );

    return paramCheck;

}

/**
 * @description this method select a 
 * charge method depends on the given string param.
 * @param {string} method charge method name.
 * @return {function} charge function
 */
function selectChargeMethod (method) {
    if (chargeMethods[method]) {
        return chargeMethods[method];
    }
}

// charging methods registery
var chargeMethods = {
    stripe: stripe
};

module.exports = {
    charge: charge,
    refund: refund
};
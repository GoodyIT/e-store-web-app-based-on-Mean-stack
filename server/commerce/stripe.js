var config = require('../config');
var stripe = require("stripe")(config.COMMERCE.STRIPE_SEC_KEY);

/**
 * @description charge cutomer using stripe apis.
 * @argument {object} orderData given order data to charge for.
 * @return {Promise} return promise with either charge id or error message.
 */
function charge(orderData) {

    return new Promise((resolve, reject) => {

        stripe.charges.create(
            {
                amount: orderData.payment.amount,
                currency: 'usd',
                source: orderData.payment.cardToken,
                description: 'Charge for ' + orderData.cutomerInfo.email,
                // The email address to send this charge's receipt to.
                receipt_email: orderData.cutomerInfo.email,
                // string displayed on customer's credit card statement
                statement_descriptor: 'BluStore statement'
            },
            function (err, charge) {
                // return any error otherwise return charge id 
                if (err) return reject(err);

                resolve(charge.id);
            }
        );

    });

}

/**
 * @description refund charges to client
 * @argument {string} chargeId charging id
 * @return {Promise} either error or resolve refund result
 */
function refund (chargeId) {

    return new Promise((resolve, reject) => {

        stripe.refunds.create(
            { charge: chargeId },
            function (err, refundInfo) {
                if (err) return reject(err);
                resolve(refundInfo);
            }
        );

    });

}

module.exports = {
    charge: charge,
    refund: refund
};
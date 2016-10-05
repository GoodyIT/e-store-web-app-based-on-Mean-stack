'use strict';

var Schema = require('mongoose').Schema;

var orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        amount: { type: Number, default: 1, min: 1 }
    }],
    shippment: {
        name: String,
        phone: String,
        address: String
    },
    payment: {
        method: { type: String, enum: ['cod', 'paypal', 'stripe'] },
        transaction : String
    },
    state: { type: Boolean, default: false }
});



module.exports = orderSchema;
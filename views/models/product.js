const { groupCollapsed } = require('console');
const mongoose = require('mongoose');
const { stringify } = require('querystring');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        enum: [fruit, vegetable, dairy, bakery, cannery, meat]
    }
    description: String,
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
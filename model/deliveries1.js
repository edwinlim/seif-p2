const mongoose = require('mongoose')

const deliveriesSchema = new mongoose.Schema({

    id: String,
    name: String,
    postalCode: String,
    address: String,
    
})

const DeliveriesModel = mongoose.model('deliveries', deliveriesSchema)

module.exports = DeliveriesModel









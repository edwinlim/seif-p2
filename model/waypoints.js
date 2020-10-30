const mongoose = require('mongoose')

const waypointSchema = new mongoose.Schema({

    name: String,
    address: String,
    date: Date

})


const WaypointModel = mongoose.model('waypoint', waypointSchema)

module.exports = WaypointModel;
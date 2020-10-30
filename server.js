// =======================================
//              DEPENDENCIES
// =======================================
require('dotenv').config()
const { default: Axios } = require('axios');
const express = require('express');
const methodOverride = require('method-override')
const controller = require('./controllers/deliveryController')
const app = express();
const mongoose = require('mongoose')
const lodash = require('lodash')
const port = 3000;

//const bakeGoodsController = require('./controllers/BakedGoodsController')

// set template engine to use
app.set('view engine', 'ejs')

// tell Express app where to find our static assets
app.use(express.static('public'))

// tell Express app to make use of the imported method-override library
app.use(methodOverride('_method'))

app.use(express.urlencoded({
    extended: true
}))


// =======================================
//              ROUTES
// =======================================

//index


//const deliveriesData = require('./model/deliveriesSeed')
const DeliveriesModel = require('./model/deliveries');
const WaypointModel = require('./model/waypoints');

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?authSource=admin&replicaSet=atlas-vh6esw-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`
//const mongoURI = 'mongodb://localhost:27017/'
mongoose.set('useFindAndModify', false)

// connect to DB, then inititate Express app
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(response => {
        // DB connected successfully
        console.log('DB connection successful')

        app.listen(process.env.PORT || port, () => {
            console.log(`App started on: ${port}`)
        })
    })
    .catch(err => {
        console.log(err)
    })


app.get('/map', (req, res) => {
    res.render('map')
})

app.get('/edit', (req,res)=> {
    res.render('edit')
})

app.get('/deliveries', controller.listDeliveries)

app.get('/', (req, res) => {

    DeliveriesModel.find()
        .then(results => {

            console.log(results[0].date)
            res.render('index', {
                jobs: results
            })
        })

})

app.patch('/update/:id', controller.updateDeliveryJob)

app.get('/list', controller.listAllDeliveries)

app.post('/add', controller.addWaypointToDB)

app.delete('/delete/:id', controller.deleteJob)

app.get('/map/:id', controller.locateDeliveryLocation)


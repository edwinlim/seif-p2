
require('dotenv').config()
const lodash = require('lodash')
const axios = require('axios')
const crypto = require('crypto')
const api = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
const key = '&key=AIzaSyCLizIMWsnndbOO1otEWtbnQ-W6e9HRexo'
const DeliveriesModel = require('./../model/deliveries');
const WaypointModel = require('./../model/waypoints')

const controllers = {

    listDeliveries: (req, res) => {

        //get the deliveries from detrack API
        axios.get('https://app.detrack.com/api/v2/dn/jobs?date=2020-10-05', {
            headers: {
                'x-api-key': `${process.env.DETRACK_KEY}`,
                'Content-type': 'application/json'
            }

        })
            .then(function (response) {
                res.send(response.data.data)
                console.log(response.data.data)
                // let data = JSON.parse(response.data)

                DeliveriesModel.insertMany(response.data.data)
                    .then(insertResponse => {
                        console.log(insertResponse)
                    })
                    .catch(insertErr => {
                        console.log(insertErr)
                    })

            })
    },
    addWaypointToDB: (req, res) => {

            let udid=crypto.randomBytes(16).toString('hex');

        DeliveriesModel.create({
            deliver_to_collect_from: req.body.name,
            address: req.body.address,
            postalcode: req.body.postalcode,
            date: req.body.date,
            id:udid
        })
            .then(result => {
                res.redirect('/')
            })
            .catch(err => {
                console.log(err)
                res.redirect('/')
            })


    },

    listWaypoints: (req, res) => {

        WaypointModel.find()
    },

    listAllDeliveries: (req, res) => {
        DeliveriesModel.find()
            .then(results => {

                res.render('list', {
                    jobs: results
                })
            })
    },

    updateDeliveryJob: (req,res) => {
        console.log(req.params.id)
        DeliveriesModel.updateOne({
            id:req.params.id
        }, 
        {
            deliver_to_collect_from:req.body.name,
            address: req.body.address
            
        }
        )
            .then(updateResult => {
                console.log(updateResult)
                res.redirect('/list')
            })
            .catch(err => {
                console.log(err)
                res.redirect('/list')
            })
        
    },

    deleteJob: (req,res) => {
        DeliveriesModel.deleteOne({
            id: req.params.id
        })
        .then (updateResult=>{
            res.redirect('/list')
        })
        .catch(err =>{
            res.redirect('/list')
        })
    },

    locateDeliveryLocation: (req,res) => {

        DeliveriesModel.findOne({
            id:req.params.id
        })
        .then (updateResult=> {
           
            let url=encodeURI(api+updateResult.address+key)
            
            axios.get(url)
            .then(function(response) {
                let location = response.data.results[0].geometry.location
                
                res.render('map', {
                    location: location
                })
            })
            .catch(err=> {
                console.log(err)
                res.redirect('/')
            })

        })

    }

   

}

module.exports = controllers;


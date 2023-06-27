const express = require('express');
const app = express();
const router = express.Router()
const axios = require('axios');
const config = require('../config')
const googleKey = config.googleKey
const Location = require('../models/location')




router.get('/', (req, res) => {
    const currUserName = req.cookies.username;
    let ifAdmin = false;
    if(currUserName=='admin'){
      ifAdmin= true
    }
    if(!currUserName){
      res.send('<h1>you must log in to visit this site</h1>')
    }else{
      res.render('about', { title: 'About',googleKey,currUserName,ifAdmin});
    }
    });


    router.get("/locations", async (req, res) => {
        try {
          const locations = await Location.find({}, { _id: 0, __v: 0 });
          res.json(locations);
        } catch (error) {
          console.error("Error fetching locations:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      });



module.exports = router;

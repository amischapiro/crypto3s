const express = require('express');
const app = express();
const router = express.Router()

router.get('/',(req,res)=>{
    res.send()
})

router.post('/',(req,res)=>{
    res.send()
})



module.exports = router;



///and then in server.js const homeRoutes = require('./routes/home')
// in server.js app.use('/',homeRoutes)
//add includes for mongo and whatever else we need
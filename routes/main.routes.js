const router = require('express').Router()
const fetch = require('node-fetch')
//const verify = require('./verifyToken')
const moment = require('moment')

const alarmController = require('../controllers/alarmController')
const userController = require('../controllers/userController')
const getMqtt = require('../serverMqtt').getMqttClient
const Tools = require('../nodeTools')
Tools.readFile("greetings.txt")


const mdb = require('../mongoCollections')

const apiUrl = process.env.API_URL



/// DATA 
//let devices = [] //['ESP_35030', 'ESP_15060']


const ioList = [{'name': 'Lamp_1', 'io': 13},
                {'name': 'Lamp_2', 'io': 21},
                {'name': 'Fan_1',  'io': 5},
                {'name': 'Heat_1', 'io': 4},
                {'name': 'Pump_1', 'io': 18},
                {'name': 'Pump_2', 'io': 19}]
             
const mqttinfo = JSON.stringify({ user: process.env.MQTT_USER, pass: process.env.MQTT_PASS })




////   free routes

router.get("/", async (req, res) => { 
    const response = await fetch(apiUrl + '/api/heartbeats/devices')
    const list = await response.json()
    console.log(list)
    res.render('iot', { mqttinfo: mqttinfo, devices: list.data })
   // res.render('index',    { name: req.session.email }) 
}) 

router.get('/index',  async (req, res) => {  
    const response = await fetch(apiUrl + '/api/heartbeats/devices')
    const list = await response.json()
    console.log(list)
    res.render('iot', { mqttinfo: mqttinfo, devices: list.data })
})

router.get("/iGrow", (req, res) => {  res.send('Hello')  })

router.get('/empty', (req, res) => {  res.render('empty') })

router.get('/cams',  (req, res) => {  res.render('cams')  })

const HeartbeatDB = require('../models/heartbeatModel')

router.get('/device',  async (req, res) => {
   
    const list = await HeartbeatDB.distinct("sender")

    let selected;
    if(req.session.selectedDevice)  selected = req.session.selectedDevice
    else selected = list[0] 

    const alarmList = await alarmController.getAll() //console.log(alarmList)

    res.render('device', { ioList: ioList, mqttinfo: mqttinfo , devices: list, selected: selected, alarmList: alarmList})
})

router.get('/graphs',  async (req, res) => { 
    
    const list = await HeartbeatDB.distinct("sender")

    let selected
    if(req.session.selectedDevice)  selected = req.session.selectedDevice
    else selected = list[0] 

    res.render('graphs',{ mqttinfo: mqttinfo, devices: list, selected: selected })
})


const User = require('../models/userModel');

router.get('/settings',  (req, res) => {

    User.get((err, users)=> { 
        if(err) console.log(err)
        res.render('settings', {users: users})
    })
    
})

router.get('/iot',  async (req, res) => {
  
    const response = await fetch(apiUrl + '/api/heartbeats/devices')
    const list = await response.json()
    console.log(list)

    res.render('iot', { mqttinfo: mqttinfo, devices: list.data })
})



router.get('/database',  (req, res) => {
    const list = mdb.getCollections()
    console.log('Sending collection list to client: ', list)
    res.render('database', {collectionList: list })
})

router.get('/weather/:latlon', async (req, res) => {
    /* const latlon = req.params.latlon.split(',')
     const lat = latlon[0]
     const lon = latlon[1]
     const sky_url = `https://api.darksky.net/forecast/7d6708021ee4840eb38d457423ab8a9a/${lat},${lon}`
     //const sky_url = 'https://api.darksky.net/forecast/7d6708021ee4840eb38d457423ab8a9a/0,0'
                   console.log(sky_url)             
     const fetch_response = await fetch(sky_url)
     const data = await fetch_response.json() 
     //console.log(data)
     res.json(data)*/

    const latlon = req.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat, lon);
    const api_key = process.env.API_KEY;
    console.log(api_key)
    const weather_url = `https://api.darksky.net/forecast/${api_key}/${lat},${lon}/?units=si`;
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    const aq_url = `https://api.openaq.org/v1/latest?has_geo=true&coordinates=${lat},${lon}&radius=100000&order_by=distance`;

    //const aq_url = `https://api.openaq.org/v1/latest?coordinates=0,0`;
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();

    console.log(aq_url)
    console.log(aq_data)

    const data = {
        weather: weather_data,
        air_quality: aq_data
    };
    res.json(data);


})



router.get('/deviceLatest/:esp',  async (req, res) => {


    let option = {
        method: 'GET',
        headers: {
            'auth-token': req.session.userToken
        }
    }

    try {
        const response = await fetch(apiUrl + "/api/heartbeats/deviceLatest/" + req.params.esp, option)
        const respData = await response.json()
        const data = respData.data[0]
        //console.log(data)

        if (!data) {
            const message = "Could not get data";
            return res.status(400).send(message);
        }
        else {

            let now =  new moment()
            let stamp =  new moment(data.time).format('YYYY-MM-DD HH:mm:ss') 
            let duration = new moment.duration(now.diff(stamp)).asHours();
     
            data.lastConnect = duration

            if(data.wifi != -100) {
                 if(duration > 0.001)  
                 {
                    console.log('Device disconnected !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                    data.wifi   = -100
                    delete data._id
                    let dat = JSON.stringify(data)
                    console.log(dat)
                    let mq = getMqtt()
                    mq.publish('esp32/alive/'+req.params.esp, dat)  //  server sends a mqtt post on behalf of esp to log a last wifi -100 signal in db.
                 }
             }

            res.json(data)
        }
    }
    catch (err) {
        console.error(err)
    }


})


router.get('/data/:options',  async (req, res) => {

    const options = req.params.options.split(',')
    const samplingRatio = options[0]
    const espID = options[1]
    const dateFrom = options[2]
    const ratio = Number(samplingRatio)
    console.log({ ratio, espID, dateFrom })


    req.session.selectedDevice = espID

    let option = { method: 'GET', headers: { 'auth-token': req.session.userToken  }    }

    try {
        const response = await fetch(apiUrl + "/api/heartbeats/data/" + samplingRatio + "," + espID + ',' + dateFrom, option)
        const respData = await response.json()
        const data = respData.data
        res.json(data)
    }
    catch (err) {
        console.error(err)
        return res.status(400).send("Could not get data");
    }

})


router.post('/set_io', (req, res) => {

    let msg = 'esp32/' + req.body.sender + '/io/' + req.body.io_id + '/' + (req.body.io_state === 'ON' ? 'on' : 'off')
    console.log('Setting IO: ' + msg)
    let mq = getMqtt()
    mq.publish(msg, moment().format('YYYY-MM-DD HH:mm:ss'))

  //  res.redirect("/ioCard.html?io_id=" + req.body.io_id + "&name_id=" + req.body.name_id)
    res.redirect('/iot')
})


module.exports = router;
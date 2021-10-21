const fetch = require("node-fetch")



const esp32 = {
  getESPConfig: async (espID) =>    //  TODO : SHOULD BE dans la BD
  {
     
    let config = []

    if(espID.indexOf("ESP_38990") >= 0) {   //   TODO:  still WEMOSIO??
      config = [ { io: 2,  mode: "IN", lbl: "A0",  isA: 0, pre: "none" } 
                ,{ io: 4,  mode: "IN", lbl: "A1",  isA: 0, pre: "none" }
                ,{ io: 35, mode: "INPULL", lbl: "A2",  isA: 1,  pre: "none" }
                ,{ io: 34, mode: "INPULL", lbl: "A3",  isA: 1,  pre: "none" }
                ,{ io: 36, mode: "INPULL", lbl: "A4",  isA: 1,  pre: "none" }
                ,{ io: 39, mode: "INPULL", lbl: "A5",  isA: 1,  pre: "none" }
  
                ,{ io: 26, mode: "IN", lbl: "D2",  isA: 0, pre: "none" }
                ,{ io: 25, mode: "IN", lbl: "D3",  isA: 0, pre: "none" }
                ,{ io: 17, mode: "IN", lbl: "D4",  isA: 0, pre: "none" }
                ,{ io: 16, mode: "IN", lbl: "D5",  isA: 0, pre: "none" }
                ,{ io: 27, mode: "IN", lbl: "D6",  isA: 0, pre: "none" }
                ,{ io: 14, mode: "IN", lbl: "D7",  isA: 0, pre: "none" }
                ,{ io: 12, mode: "IN", lbl: "D8",  isA: 0, pre: "none" }
                ,{ io: 13, mode: "IN", lbl: "D9",  isA: 0, pre: "none" }
                      //DigitalInput _D10( 5, "D10");  //  GPIO 5 seems unusable
                ,{ io: 23, mode: "IN", lbl: "D11", isA: 0, pre: "none" }
                ,{ io: 19, mode: "IN", lbl: "D12", isA: 0, pre: "none" }
                ,{ io: 18, mode: "IN", lbl: "D13", isA: 0, pre: "none" } ]; 
    }
   else {
  
     // IO Configuration
      // ESP32 HUZZAH32
     
      // *** Note :
      //           you can only read analog inputs on ADC #1 once WiFi has started *** //
      //           PWM is possible on every GPIO pin
      
      //DigitalInput _A0( 26, "A0");  // A0 DAC2 ADC#2 not available when using wifi 
      //DigitalInput _A1( 25, "A1");  // A1 DAC1 ADC#2 not available when using wifi
   /*   AnalogInput  _A2( 34, "GAZ");  // A2      ADC#1   Note it is not an output-capable pin! 
      AnalogInput  _A3( 39, "LIGHT");  // A3      ADC#1   Note it is not an output-capable pin! 
      AnalogInput  _A4( 36, "SOIL1");  // A4      ADC#1   Note it is not an output-capable pin! 
      DigitalInput _A5(  4, "HEAT1");  // A5      ADC#2  TOUCH0 
      DigitalInput _SCK( 5, "FAN1");  // SPI SCK
      DigitalInput _MOSI( 18, "PUMP1");   // MOSI
      DigitalInput _MISO( 19, "PUMP2");  // MISO
      // GPIO 16 - RX
      // GPIO 17 - TX
      PullupInput _D21( 21, "BLUE"); 
      // 23		            BMP280	            SDA
      // 22		            BMP280	            SCL
      DigitalInput _A6( 14, "DHT");  // A6 ADC#2
      // 32		                                A7 can also be used to connect a 32 KHz crystal
      DigitalInput _A8( 15, "MOVE"); // 15		A8 ADC#2
      // 33		             	                A9
      // 27		            	                A10 ADC#2
      // 12	            	          	        A11 ADC#2 This pin has a pull-down resistor built into it, we recommend using it as an output only, or making sure that the pull-down is not affected during boot
      DigitalOutput _A12( 13, "LED1");  // A12  ADC#2  Builtin LED
      AnalogInput  _A13( 35, "VBAT");   // A13 This is general purpose input #35 and also an analog input, which is a resistor divider connected to the VBAT line   Voltage is divided by 2 so multiply the analogRead by 2
      */
  
  
  /*
     let config1 = [  { io: "34",  mode: "IN", lbl: "A2",  isA: "1" } 
                ,{ io: "39",  mode: "IN", lbl: "A3",  isA: "1" }
                ,{ io: "36", mode: "IN", lbl: "A4",  isA: "0" }
                ,{ io: "4", mode: "IN", lbl: "A5",  isA: "0" }
                ,{ io: "21", mode: "OUT", lbl: "D3",  isA: "0" } ]; 
      let c1 =  await JSON.stringify(config1)
  
      let config2  = [ // { io: "6", mode: "IN", lbl: "SPI",  isA: "0" }
                 // ,{ io: "18", mode: "IN", lbl: "MISO",  isA: "0" }
                 // ,{ io: "19", mode: "IN", lbl: "MOSI",  isA: "0" }
                ];
      let c2 =  await JSON.stringify(config2)
  
      let config3  = [  { io: "14", mode: "IN", lbl: "D4",  isA: "0" }
                  ,{ io: "15", mode: "IN", lbl: "D5",  isA: "0" }
                  ,{ io: "13", mode: "IN", lbl: "D6",  isA: "0" }
                  ,{ io: "35", mode: "IN", lbl: "D7",  isA: "0" } ];
      let c3 =  await JSON.stringify(config3)*/
      
  
      config = [  
       { io: "34",  mode: "IN", lbl: "A2",  isA: "1" } 
      ,{ io: "39",  mode: "IN", lbl: "A3",  isA: "1" }
      ,{ io: "36", mode: "IN", lbl: "A4",  isA: "0" }
      ,{ io: "4", mode: "IN", lbl: "A5",  isA: "0" }
      ,{ io: "21", mode: "OUT", lbl: "D3",  isA: "0" } 
  
   // { io: "6", mode: "IN", lbl: "SPI",  isA: "0" }
       // ,{ io: "18", mode: "IN", lbl: "MISO",  isA: "0" }
       // ,{ io: "19", mode: "IN", lbl: "MOSI",  isA: "0" }
  
      ,{ io: "14", mode: "IN", lbl: "D4",  isA: "0" }
      ,{ io: "15", mode: "IN", lbl: "D5",  isA: "0" }
      ,{ io: "13", mode: "IN", lbl: "D6",  isA: "0" }
      ,{ io: "35", mode: "IN", lbl: "D7",  isA: "0" } ];

      }


    return config
  },
  
  saveEspPost: async (data, pathDB) =>
  {
      
    const option = {
      method: 'POST',
      headers: {      "Content-type": "application/json"    },
      body: JSON.stringify(data)
    }
  
    try {
      const rawResponse = await fetch(pathDB, option);
      const r = await rawResponse.text()
  
      if (r === 'Access Denied') { console.log(r) }
      else {
        try {
          const result = JSON.parse(r)
  
          if (result.sender) {       /* console.log('Success: ' + result.sender)  */        }
          else {        console.log('Error: ' + result)  }
        } catch (error) {
          console.log(r)
        }
        
      }
  
    }
    catch (err) { console.log(err) }
     
  },
  
  setESPConfig: async (espID, mqttclient) => 
  {
    const t = 'esp32/' + espID + '/config'
    const config = await esp32.getESPConfig(espID)
    const c1 =  JSON.stringify(config)
  
   // mqttclient.publish(t+"/start", "")
    mqttclient.publish(t, c1 )
   // mqttclient.publish(t +"/done", "" )


  }
  
}


module.exports = esp32
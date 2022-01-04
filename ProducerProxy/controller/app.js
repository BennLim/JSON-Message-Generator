const express = require("express");
const app = express();
const { Kafka } = require('kafkajs')
var bodyParser = require('body-parser');

const kafka = new Kafka({
  clientId: '0',
  brokers: ['localhost:9092']
})

const producer = kafka.producer(); 

const run = async (data) => {
    // Producing
    await producer.connect()
    await producer.send(data) 
  
  }
  

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/topics/:topic', (req, res) => {

    var data = {
        topic: req.params.topic,
        messages: [
            {value: JSON.stringify(req.body.value)},
        ]
      }
    console.log(data);
    run(data).catch(console.error)
    res.status(200);
    res.send(data);
})

module.exports = app;
// const axios = require("axios");

// axios.post("http://192.168.1.96:8082/topics/test", {
//   records: [{ value: "Plain"}]
// }, {
//   headers: { 'Content-Type': "application/vnd.kafka.json.v2+json" }
// }).then((response) => {
//   console.log(response);

// }).catch((error) => {
//   console.log(error);
// });

const { Kafka } = require('kafkajs')
 
const kafka = new Kafka({
  clientId: '0',
  brokers: ['192.168.68.106:9092']
})
 
const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
  // Producing
  await producer.connect()
  await producer.send({
    topic: 'test',
    messages: [
        { key: 'finaltest2', value: "[1,2,5]"},
    ],
  }) 

  // // Consuming
  // await consumer.connect()
  // await consumer.subscribe({ topic: 'Objects', fromBeginning: true })
 
  // await consumer.run({
  //   eachMessage: async ({ topic, partition, message }) => {
  //     console.log({
  //       partition,
  //       offset: message.offset,
  //       value: message.value.toString(),
  //     })
  //   },
  // })

}


run().catch(console.error)

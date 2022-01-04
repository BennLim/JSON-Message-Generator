
const { log } = require('console');
const { Kafka } = require('kafkajs')
const WebSocket = require('ws');
var closingStatus = false;

const run = async (ws, consumer, topic, secondTopic) => {

    ws.onclose = async () => {
        closingStatus = true;
        await consumer.disconnect();
        await console.log("\nCLient Disconnected\n");
    }


    await consumer.connect();
    await consumer.subscribe({ topic: topic, fromBeginning: true })
    if (secondTopic != "null") {
        console.log("TEST");
        await consumer.subscribe({ topic: secondTopic, fromBeginning: true })
    }


    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString(),
            })
            ws.send(JSON.stringify({ partition, offset: message.offset, value: message.value.toString(), topic: topic }));

        },
    });



}

const kafka = new Kafka({
    clientId: 'json_generator',
    brokers: ['localhost:9092']
})

const wss = new WebSocket.Server({ port: 9999 })

wss.on("connection", (ws) => {

    ws.onmessage = (message) => {
        var details = JSON.parse(message.data);

        console.log("\nNew client Connected:\n", details, "\n");

        // Creates consumer in group supplied
        const consumer = kafka.consumer({ groupId: details.group });

        run(ws, consumer, details.topic, details.secondTopic).catch(console.error);
    }


})






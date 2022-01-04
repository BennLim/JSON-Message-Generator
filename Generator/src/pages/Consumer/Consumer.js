import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Accordion } from 'react-bootstrap';

function ConnectWs(topic, group, setMessages, connect) {
    var server = 'ws://localhost:9999/';
    var ws = new WebSocket(server + '?topic=' + topic + '&consumerGroup=' + group);
    setMessages([]);
    if (connect === true) {
        ws.close();
        console.log("Socket Closed");
    }
    ws.onopen = () => {
        console.log('Opened socket to server for topic ' + topic);
        document.title = group;
        ws.send(`{ "topic": "${topic}", "group": "${group}"}`)
    };

    ws.onerror = (error) => {
        console.log(error);
    };

    ws.onmessage = (data, flags) => {

        console.log(data);
        let batch = JSON.parse(data.data);
        setMessages(messages => [...messages, batch]);
        console.log(batch);
        let value = JSON.parse(batch.value);

    };
}

function Consumer() {
    const [messages, setMessages] = useState([]);
    const [kafkaDetails, setKafkaDetails] = useState({ topic: "", group: "" });
    const [connect, setConnect] = useState(false);

    return (
        <Container >
            <Row className=" bg-dark text-light">
                <h1>Messages:</h1>
            </Row>
            <Row>
                <Col className="border border-5 border-dark bg-light text-dark" style={{ width: "65%", }}>
                    <Accordion style={{ height: "54em", overflow: "auto" }}>
                        {messages.map((message, index) => {
                            console.log(messages);

                            return (
                                <Accordion.Item key={index} eventKey={index}>
                                    <Accordion.Header><b className="text-success">{message.offset}:&nbsp;</b>{message.value}</Accordion.Header>
                                    <Accordion.Body>
                                        <p>
                                            <b>Partition:</b>  {message.partition}
                                            <br />
                                            <b>Offset:</b> {message.offset}
                                        </p>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )
                        })}
                    </Accordion>
                </Col>
                <Col md lg={{ span: 4 }} className="bg-dark text-white">
                    <Form.Group>
                        <Form.Label column="sm">Kafka Topic:</Form.Label>
                        <Form.Control size="sm" type='text' placeholder="Kafka Topic" onChange={(e) => setKafkaDetails({ ...kafkaDetails, topic: e.target.value })} value={kafkaDetails.topic} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label column="sm">Consumer Group:</Form.Label>
                        <Form.Control size="sm" type='text' placeholder="Consumer Group" onChange={(e) => setKafkaDetails({ ...kafkaDetails, group: e.target.value })} value={kafkaDetails.group} />
                    </Form.Group>

                    <div className="d-grid gap-2 mt-3">
                        <Button onClick={() => { ConnectWs(kafkaDetails.topic, kafkaDetails.group, setMessages, connect); setConnect(!connect) }} variant={connect ? "danger" : "success"} size="md">{connect ? "Disconnect" : "Subscribe"}</Button>
                    </div>
                </Col>
            </Row>



        </Container>
    )
}

export default Consumer;
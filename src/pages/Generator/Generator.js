import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Dropdown, DropdownButton, Button, Collapse, Spinner } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import * as RandExp from "randexp";
import axios from 'axios';

function InputBox({ type, fields, index, UpdateField }) {

    switch (type) {
        case "String": return (
            <Form.Control type="text" onChange={(e) => UpdateField(index, "value", e.target.value)} value={fields[index]['value']} />
        );
        case "Regex": return (
            <Form.Control type="text" onChange={(e) => UpdateField(index, "value", e.target.value)} value={fields[index]['value']} />
        );
        case "Number": return (
            <>
                <Form.Control type="number" placeholder="Min" onChange={(e) => UpdateField(index, "value", parseFloat(e.target.value))} value={fields[index]['value']} />
                <Form.Control type="number" placeholder="Max" onChange={(e) => UpdateField(index, "value2", parseFloat(e.target.value))} value={fields[index]['value2']} />
            </>
        );
        case "Boolean": return (
            <Form.Select onChange={(e) => UpdateField(index, "value", e.target.value)} value={fields[index]['value']}  >
                <option value="Random">Random</option>
                <option value={true}>True</option>
                <option value={false}>False</option>
            </Form.Select>
        );
        case "Date": return (
            <>
                <Form.Control type="datetime-local" onChange={(e) => UpdateField(index, "value", e.target.value)} value={fields[index]['value']} />
                <Form.Control type="datetime-local" onChange={(e) => UpdateField(index, "value2", e.target.value)} value={fields[index]['value2']} />
            </>
        );
        default: return (
            <Form.Control />
        );
    }
}

function Generator() {
    function AddFields(number) {
        var tempFields = [];
        if (fields.length < number) {
            for (var i = fields.length; i < number; i++) {
                tempFields.push({ type: "String", key: "", value: "", value2: "" });
            }
            setFields([...fields, ...tempFields]);


        } else {
            if (number !== "") {
                setFields(fields.filter(field => fields.indexOf(field) < parseInt(number)));
            }
        }

    }

    function RemoveField(index) {
        if (fields.length > 1) {
            const tempFields = [...fields];
            tempFields.splice(index, 1);
            setFields(tempFields);
        }

    }

    function UpdateField(index, fieldKey, newValue) {
        const tempFields = [...fields];
        tempFields[index][fieldKey] = newValue;
        setFields(tempFields);

    }

    function Generate(e) {
        e.preventDefault();
        let key, value, jsonObject;
        for (var u = 0; u < messageCount; u++) {

            jsonObject = {};
            for (var i = 0; i < fields.length; i++) {
                key = fields[i].key;
                if (fields[i].type === "Number") {
                    let min = fields[i].value;
                    let max = fields[i].value2;
                    if (min <= max) {
                        value = Math.floor(Math.random() * (max - min) + min);
                    } else {
                        ReactDOM.render("Invalid range: (max > min)", document.getElementById("errorMessage-" + i))
                    }

                } else if (fields[i].type === "Date") {
                    let start = new Date(fields[i].value);
                    let end = new Date(fields[i].value2);
                    value = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

                } else if (fields[i].type === "Regex") {
                    value = new RandExp(fields[i].value).gen();

                } else if (fields[i].type === "Boolean" && fields[i].value === "Random") {
                    value = Math.random() < 0.5;

                } else {
                    value = fields[i].value;
                }

                jsonObject[key] = value;
            }

            console.log(jsonObject);

            // NEEDS REFACTORING
            axios.post(`/topics/${kafkaTopic}`, {
                value: jsonObject 
            }, {
                // headers: { 'Content-Type': "application/vnd.kafka.json.v2+json" }
            }).then((response) => {
                console.log(response);

            }).catch((error) => {
                console.log(error);
            });
        }



    }

    const [fields, setFields] = useState([
        { type: "String", key: "", value: "", value2: "" },
    ]);
    const [messageCount, setMessageCount] = useState(1);
    const [multipleCheck, setMultipleCheck] = useState(false);
    const [kafkaTopic, setKafkaTopic] = useState("");

    document.title = "Producer"
    useEffect(() => {
        // Checks for any fields from a previous session (Stored in localstorage)
        if (localStorage.getItem("fields")) {
            setFields(JSON.parse(localStorage.getItem("fields")));
        }
    }, [])

    useEffect(() => {
        // sets fields to localstorage
        localStorage.setItem("fields", JSON.stringify(fields));
    }, [fields])

    return (
        <Container >
            <Row>

                <Card className="shadow-lg">
                    <Card.Header className="bg-dark text-white">
                        <Card.Title >JSON Message Generator (Kafka Producer)</Card.Title>
                    </Card.Header>

                    <Card.Body className="bg-dark text-white">

                        <Form onSubmit={Generate} className="pb-5 px-5">

                            <Row className="mb-2">
                                <Col md lg={{ span: 3 }}>
                                    <Form.Group>
                                        <Form.Label column="sm">Kafka Topic</Form.Label>
                                        <Form.Control size="sm" type='text' placeholder="Kafka Topic" onChange={(e) => setKafkaTopic(e.target.value)} value={kafkaTopic} />
                                    </Form.Group>
                                </Col>
                                <Col md lg={{ span: 2, offset: 7 }}>
                                    <Form.Group>
                                        <Form.Label column="sm">No. of Fields:</Form.Label>
                                        <Form.Control size="sm" type='number' min={1} onChange={(e) => AddFields(e.target.value)} value={fields.length} />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {fields.map((field, index) => {

                                return (
                                    <Collapse appear in={true}>

                                        <Row key={index}>
                                            <Form.Group >
                                                <Form.Label className="mt-3" column="sm">Field {index + 1}:</Form.Label>
                                                <InputGroup size="sm">
                                                    <DropdownButton variant="success" title={field.type} align="end">
                                                        <Dropdown.Item onClick={() => UpdateField(index, "type", "String")}>String</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => UpdateField(index, "type", "Regex")}>Regex</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => UpdateField(index, "type", "Number")}>Number</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => UpdateField(index, "type", "Boolean")}>Boolean</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => UpdateField(index, "type", "Date")}>Date</Dropdown.Item>
                                                    </DropdownButton>
                                                    <InputGroup.Text>
                                                        <Form.Control key={index} size="sm" type='text' onChange={(e) => UpdateField(index, "key", e.target.value)} value={fields[index]['key']} />&nbsp;<b>:</b>
                                                    </InputGroup.Text>

                                                    <InputBox type={field.type} fields={fields} index={index} UpdateField={UpdateField} />
                                                    <Button variant="outline-danger" onClick={() => RemoveField(index)}><FontAwesomeIcon icon={faTrash} /></Button>

                                                </InputGroup>
                                            </Form.Group>
                                            <p id={"errorMessage-" + index} className="text-danger"></p>
                                        </Row>
                                    </Collapse>
                                )
                            })}

                            <Row className="my-3">
                                <Col md lg={2}>
                                    <Form.Group>
                                        <Form.Label column="sm">
                                            <Form.Check label="Multiple Messages" onChange={() => setMultipleCheck(!multipleCheck)} />
                                        </Form.Label>
                                        <Collapse in={multipleCheck} onExited={() => setMessageCount(1)} >
                                            <div>
                                                <Form.Control size="sm" type='number' min={1} onChange={(e) => setMessageCount(e.target.value)} value={messageCount} />
                                            </div>
                                        </Collapse >

                                        {/* {multipleCheck ? <Form.Control size="sm" type='number' min={1} onChange={(e) => setMessageCount(e.target.value)} value={messageCount} /> : null} */}
                                    </Form.Group>
                                </Col>

                            </Row>

                            <Row className="px-2">
                                <Button type="submit" variant="success" >Generate</Button>
                            </Row>


                        </Form>


                    </Card.Body>
                </Card>
            </Row>
        </Container>
    )
}

export default Generator;
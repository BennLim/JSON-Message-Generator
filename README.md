# JSON-Message-Generator
A React web application to generate Random JSON Objects to be sent as messages to back-end for processing

*Main use to produce and consume data to and from Apache Kafka® topics

Datatypes Available:
1. String (static)
2. Random string (according to RegEx supplied)
3. Integer (between range supplied)
4. Boolean
5. Date (between range supplied)

Generator is accompanied by a consumer which allows for users to subscribe to Kafka Topics and receive data produced to them

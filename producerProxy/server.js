var express = require('express');
var app = require('./controller/app.js');

var port = 9998;


var server = app.listen(port, function(){
    console.log('Kafka Producer Proxy hosted at http://localhost:%s', port);
});


    
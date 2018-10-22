'use strict';
var mysql = require('mysql');
var config = require("./config").database;

var query = function(queryString = '', callback) {
	var connection = mysql.createConnection(config);
	connection.connect();
	connection.query(queryString, callback);
	connection.end();
};

module.exports = {
	'query': query
};
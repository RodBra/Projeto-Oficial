'use strict';
var mysql = require('mysql');
var sql = require('mssql');
var config = require("./config").database;

/*var query = function(queryString = '', callback) {
	var connection = mysql.createConnection(config);
	connection.connect();
	connection.query(queryString, callback);
	connection.end();
};*/

var query = function(queryString = '') {
	return new Promise((res, rej) => {
        sql.connect(config).then(pool => {
            return pool.request().query(queryString);
        }).then(results => {
            res(results);
        }).catch(e => {
            rej(e);
        }).finally(() => {
            sql.close();
        });
    });
};

module.exports = {
	'query': query
};

// não mexer neste arquivo!!!

'use strict';
var mysql = require('mysql');
var config = require("./config").database;

var query = function(queryString = '') {
	var sql = require('mssql');
	sql.close();
	return new Promise((res, rej) => {
        sql.connect(config).then(pool => {
            return pool.request().query(queryString);
        }).then(results => {
            res(results);
        }).catch(e => {
			sql.close();
            rej(e);
        }).finally(() => {
            sql.close();
        });
    });
};

module.exports = {
	'query': query
};

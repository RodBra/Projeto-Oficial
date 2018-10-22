'use strict';

var express = require('express');
var router = express.Router();
var isNull = require('../script').isNull;
var Database = require('../Database');
const Cryptr = require('cryptr');
const config = require('../config');
const cryptr = new Cryptr(config.security.key);
const moment = require('moment-timezone');

router.get('/', (req, res, next) => {
    //console.log(req.session);
    /*if (!req.session.user || req.session.user && !req.session.user.logged_in) {
        res.redirect('/login');
    } else {*/
        let limit = 50;
        Database.query(`SELECT TOP ${limit} momento, temperatura, umidade FROM leitura`, (error, results, rows) => {
            if (error) {
                console.log(error);
                res.status(400).json({"error": "error reading database"});
            }
            results = results.recordsets[0];

            let data = [['momento', 'temperatura', 'umidade']];

            for (let i = 0; i < results.length; i++) {
                let row = results[i];
                //let momento = moment(row.momento).format('YYYY, MM, DD, HH, mm, ss');
                let momento = moment(row.momento).format('HH-mm-ss');
                let entry = [momento, row.temperatura, row.umidade];
                data.push(entry);
            }
            res.json(data);
        });
    //}
});

router.get('/dt', (req, res, next) => {

    let limit = 50;
    let response = {};
    Database.query(`SELECT TOP ${limit} momento, temperatura, umidade FROM leitura`).then(results => {
        results = results.recordsets[0];

        response.cols = [
            {id: 'momento', label: 'momento', type: 'timeofday'},
            {id: 'temperatura', label: 'temperatura', type: 'number'},
            {id: 'umidade', label: 'umidade', type: 'number'}
        ];
        let rows = [];
        for (let i = 1; i < results.length; i++) {
            let row = results[i];
            //let momento = moment(row.momento).format('YYYY, MM, DD, HH, mm, ss');
            let momento = moment(row.momento).format('HH-mm-ss').split('-');
            let entry = {
                c: [{v: momento},
                    {v: row.temperatura},
                    {v: row.umidade}
                   ]
               };
            rows.push(entry);
        }
        response.rows = rows;
        res.json(response);
    }).catch(error => {
        console.log(error);
        res.status(400).json({"error": "error reading database"});
    });

});

router.post('/', (req, res, next) => {
    Database.query(`INSERT INTO LEITURA (temperatura, umidade, momento)
                    VALUES (${req.body.temperatura}, ${req.body.umidade}, NOW())`, (error, results, rows) => {
                        if (error) {
                            res.json({
                                code: 0,
                                message: 'failed to add values to database',
                                error: error
                            });
                        }
                        res.json({
                            code: 1,
                            message: 'success',
                            response: results
                        });
                    });
});

module.exports = router;

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
        Database.query(`SELECT momento, temperatura, umidade FROM leitura ORDER BY id DESC LIMIT ${limit}`, (error, results, rows) => {
            if (error) {
                console.log(error);
                res.status(400).json({"error": "error reading database"});
            }
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
    Database.query(`SELECT momento, temperatura, umidade FROM leitura ORDER BY id DESC OFFSET 0 ROWS FETCH NEXT ${limit} ROWS ONLY`, (error, results) => {
        if (error) {
            console.log(error);
            res.status(400).json({"error": "error reading database"});
        }
        response.cols = [
            {id: 'momento', label: 'momento', type: 'timeofday'},
            {id: 'temperatura', label: 'temperatura', type: 'number'},
            {id: 'umidade', label: 'umidade', type: 'number'}
        ];
        let rows = [];
        for (let i = 0; i < results.length; i++) {
            let row = results[i];
            //let momento = moment(row.momento).format('YYYY, MM, DD, HH, mm, ss');
            let momento = moment(row.momento).format('HH-mm-ss').split('-');
            rows.push({
                c: [{v: momento},
                    {v: row.temperatura},
                    {v: row.umidade}
                   ]
                });
        }
        response.rows = rows;
        res.json(response);
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

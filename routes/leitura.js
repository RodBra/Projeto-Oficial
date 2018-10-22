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
        Database.query(`SELECT hora, temperatura, umidade FROM leitura ORDER BY id DESC LIMIT ${limit}`, (error, results, rows) => {
            if (error) {
                console.log(error);
                res.status(400).json({"error": "error reading database"});
            }
            let data = [['hora', 'temperatura', 'umidade']];
            
            for (let i = 0; i < results.length; i++) {
                let row = results[i];
                //let hora = moment(row.hora).format('YYYY, MM, DD, HH, mm, ss');
                let hora = moment(row.hora).format('HH-mm-ss');
                let entry = [hora, row.temperatura, row.umidade];
                data.push(entry);
            }
            res.json(data);
        });
    //}
});

router.get('/dt', (req, res, next) => {
    let limit = 50;
    let response = {};
    Database.query(`SELECT hora, temperatura, umidade FROM leitura ORDER BY id DESC LIMIT ${limit}`, (error, results) => {
        if (error) {
            console.log(error);
            res.status(400).json({"error": "error reading database"});
        }
        response.cols = [
            {id: 'hora', label: 'hora', type: 'timeofday'},
            {id: 'temperatura', label: 'temperatura', type: 'number'},
            {id: 'umidade', label: 'umidade', type: 'number'}
        ];
        let rows = [];
        for (let i = 0; i < results.length; i++) {
            let row = results[i];
            //let hora = moment(row.hora).format('YYYY, MM, DD, HH, mm, ss');
            let hora = moment(row.hora).format('HH-mm-ss').split('-');
            rows.push({
                c: [{v: hora},
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
    Database.query(`INSERT INTO LEITURA (temperatura, umidade, hora)
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
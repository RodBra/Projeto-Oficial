var express = require('express');
var router = express.Router();
var isNull = require('../script').isNull;
var Database = require('../Database');
const Cryptr = require('cryptr');
const config = require('../config');
const cryptr = new Cryptr(config.security.key);

router.get('/', (req, res, next) => {
    if (!req.session.user || req.session.user && !req.session.user.logged_in) {
        res.render('login', {
            'message': req.session.message || ''
        });
    } else {
        res.render('index', {
            session: req.session
        });
    }
});

router.post('/', (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    
    if (isNull(username) || isNull(password)) {
        console.log('Invalid username and/or password!');
        res.render('login', {
            'message': 'Invalid username and/or password!'
        });
    } else {
        
        Database.query(`SELECT * FROM User WHERE user = '${username}';`, (error, results, rows) => {
            console.log('entrou no query');
            if (error) {
                res.status(400).render('login', {'message': "Couldn't log in!"});
            }
            if (results.length > 0) {
                let decryptedPassword = cryptr.decrypt(results[0].senha);
                if (decryptedPassword === password) {
                    let user = {
                        nome: results[0].nome,
                        user: results[0].user,
                        id: results[0].id,
                        logged_in: true
                    };
                    req.session.user = user;
                    res.redirect('/index');
                } else {
                    res.render('login', {
                        'message': 'Invalid username/password!'
                    });
                }
            } else {
                res.render('login', {
                    'message': 'Invalid username/password!'
                });
            }
        });
    }

});

module.exports = router;
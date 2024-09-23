const express = require('express');
const router = express.Router();
const users = require('./users');
const events = require('./events');
const reviews = require('./reviews');
const login = require('./login');
const auth = require('../middlewares/auth');

router.get('', (req, res) =>{
    console.log('recibió petición get desde INDEX');
    res.send('Respuesta chida desde el GET en Index');
});

router.use('', express.json());
router.use('', login);
router.use('/users', users);
router.use('/events', auth, events);
router.use('/reviews', auth, reviews);


module.exports = router; 


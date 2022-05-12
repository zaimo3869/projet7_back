const express = require('express');
const router = express.Router();
const lim = require("../middleware/limite")
const userCtrl = require('../controllers/user');

// const authentification = require("../middleware/authentification")
router.post('/signup', userCtrl.userSignup);
router.post('/login', lim.limite ,userCtrl.login);

module.exports = router;
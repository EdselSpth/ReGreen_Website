const express = require('express');
const router = express.Router();
const { topUpSaldo } = require('../controllers/saldoController');

router.post('/topup', topUpSaldo);

module.exports = router;
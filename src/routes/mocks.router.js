const { Router } = require('express');
const { getMockingUsers, getMockingOrders, generateData } = require('../controllers/mocks.controller');

const router = Router();

router.get('/mockingusers', getMockingUsers);
router.get('/mockingorders', getMockingOrders);
router.post('/generatedata', generateData);

module.exports = router;
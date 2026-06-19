const express = require('express');
const router = express.Router();
const agentController = require('../Controllers/agentController');

router.post('/interview', agentController.interview);
router.post('/extract', agentController.extract);
router.post('/correct', agentController.correct);
router.post('/suggest-tech', agentController.suggestTech);

module.exports = router;

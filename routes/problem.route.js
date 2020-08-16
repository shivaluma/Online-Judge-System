const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticate = passport.authenticate('jwt', { session: false });
const problemController = require('../controllers/problem.controller');

router.get('/', problemController.getProblems);
router.post('/', authenticate, problemController.createProblem);

module.exports = router;
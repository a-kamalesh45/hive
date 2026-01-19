const express = require('express');
const router = express.Router();

const { login } = require('../controllers/LoginController');
const { newQuery } = require('../controllers/AddQueryController');
const { signup } = require('../controllers/SignUpController');
const { getQueries, getQueryStats } = require('../controllers/GetQueriesController');
const { resolveQuery, dismantleQuery, assignQuery, getHeads, getLeaderboard } = require('../controllers/QueryActionsController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', login);
router.post('/signup', signup);

// Protected routes - All authenticated users
router.post('/add-query', authenticate, newQuery);
router.get('/queries', authenticate, getQueries);
router.get('/query-stats', authenticate, getQueryStats);
router.get('/leaderboard', authenticate, getLeaderboard);
router.get('/heads', authenticate, getHeads);

// Protected routes - Head and Admin only
router.put('/queries/:queryId/resolve', authenticate, authorize('Head', 'Admin'), resolveQuery);
router.put('/queries/:queryId/dismantle', authenticate, authorize('Head', 'Admin'), dismantleQuery);

// Protected routes - Admin only
router.put('/queries/:queryId/assign', authenticate, authorize('Admin'), assignQuery);

module.exports = router;
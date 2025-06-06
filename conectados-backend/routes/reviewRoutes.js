// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { createReview, getReviewsByServicio } = require('../controllers/reviewController');

router.post('/', verifyToken, authorizeRoles('usuario'), createReview);
router.get('/servicio/:id', getReviewsByServicio);

module.exports = router;

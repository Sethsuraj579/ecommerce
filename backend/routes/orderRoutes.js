const router = require('express').Router();
const { createOrder, getOrders, getOrder } = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

router.use(auth);
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);

module.exports = router;
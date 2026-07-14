const router = require('express').Router();
const { getCart, addToCart, updateCartItem, removeFromCart } = require('../controllers/cartController');
const auth = require('../middleware/authMiddleware');

router.use(auth);
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateCartItem);
router.delete('/:id', removeFromCart);

module.exports = router;
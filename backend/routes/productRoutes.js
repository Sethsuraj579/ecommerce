const router = require('express').Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const adminOnly = (req, res, next) => { if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' }); next(); };

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', auth, adminOnly, createProduct);
router.put('/:id', auth, adminOnly, updateProduct);
router.delete('/:id', auth, adminOnly, deleteProduct);

module.exports = router;
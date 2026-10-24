const express = require('express');
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  updateItemStatus,
  deleteItem,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getItems)
  .post(protect, createItem);

router.route('/:id')
  .get(getItemById)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

router.patch('/:id/status', protect, updateItemStatus);

module.exports = router;

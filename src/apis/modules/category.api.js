import express from "express";
const router = express.Router();

import categoryController from '../../controllers/category.controller'

router.post('/', categoryController.create);
router.get('/', categoryController.readMany);
router.patch('/:categoryId', categoryController.update);

router.get("/:category_id", categoryController.findByCategory);

module.exports = router;
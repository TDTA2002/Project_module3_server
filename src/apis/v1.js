/* Create Express Router */
import express from 'express'
const router = express.Router()

import userModule from './modules/user'
router.use('/users', userModule)

import categoryModule from './modules/category.api'
router.use('/categories', categoryModule)

import productModule from './modules/product.api'
router.use('/products', productModule)

import purchaseModule from './modules/purchase.api'
router.use('/purchase', purchaseModule)

import receiptModule from './modules/receipt';
router.use('/receipts', receiptModule);



export default router;
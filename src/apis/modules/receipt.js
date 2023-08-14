import express from 'express'
const router = express.Router()

import receiptController from '../../controllers/receipt.controll';


router.get('/:user_id', receiptController.findReceipt)

export default router;
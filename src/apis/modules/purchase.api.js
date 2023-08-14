import express from 'express'
const router = express.Router()

import purchaseController from '../../controllers/purchase.controler';
import authencation from '../../middlewares/authencation';

router.post('/order', purchaseController.createReceipt)
router.post('/zalo-create', purchaseController.zaloCreate)
router.get('/zalo-confirm/:tradeId', purchaseController.zaloCheck)

router.post('/:user_id', authencation.checkToken, purchaseController.addToCart);
router.get('/:user_id', authencation.checkToken, purchaseController.findCart);
router.delete('/:product_id', purchaseController.deleteProductFromCart);
router.patch('/:user_id', purchaseController.updateCart);

export default router;
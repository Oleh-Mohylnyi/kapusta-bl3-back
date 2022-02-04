import { Router } from 'express'
import {
  getTransactions,
  addTransaction,
  removeTransaction
} from '../../controllers/transactions'

import {
  validateCreate,
  validateId,
  validateQuery
} from './validation'

import wrapperError from '../../middlewares/error-handler'
import guard from '../../middlewares/guard'

const router = new Router()

router.get('/', [guard, validateQuery], wrapperError(getTransactions))
router.post('/', [guard, validateCreate], wrapperError(addTransaction))
router.delete('/:id', [guard, validateId], wrapperError(removeTransaction))


export default router

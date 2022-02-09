import { Router } from 'express'
import {
    getBalance,
    getSummaryIncome
} from '../../controllers/reports'

import {
  validateQuery
} from './validation'

import wrapperError from '../../middlewares/error-handler'
import guard from '../../middlewares/guard'

const router = new Router()

router.get('/balance', [guard, validateQuery], wrapperError(getBalance))
router.get('/summary_income', [guard, validateQuery], wrapperError(getSummaryIncome))
// router.get('/summary_cost', [guard, validateQuery], wrapperError(getSummaryIncome))
// router.get('/income/:month', [guard, validateQuery], wrapperError(getSummaryIncome))
// router.get('/cost/:month', [guard, validateQuery], wrapperError(getSummaryIncome))

export default router

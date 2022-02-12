import { Router } from 'express'
import {
  getBalance,
  getSummaryIncome,
  getSummaryCost,
  getDetailReport
} from '../../controllers/reports';

import { validateQueryDetailReport } from './validation';
import wrapperError from '../../middlewares/error-handler';
import guard from '../../middlewares/guard';

const router = new Router();

router.get('/balance', [guard], wrapperError(getBalance));
router.get('/summary_income', [guard], wrapperError(getSummaryIncome));
router.get('/summary_cost', [guard], wrapperError(getSummaryCost));
router.get('/detail', [guard, validateQueryDetailReport], wrapperError(getDetailReport));

export default router;

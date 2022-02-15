import repositoryTransactions from '../../repository/transactions'
import { HttpCode } from '../../lib/constants'
import { CustomError } from '../../lib/custom-error'
import repositoryReports from '../../repository/reports'

const getTransactions = async (req, res, next) => {
  const { id: userId } = req.user;
  const transactions = await repositoryTransactions.getTransactions(userId, req.query);
  const { balance } = await repositoryReports.getBalance(userId);
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { ...transactions, balance } });
}


const addTransaction = async (req, res, next) => {
  const { id: userId } = req.user;
  const newTransaction = await repositoryTransactions.addTransaction(userId, req.body);
  res.status(HttpCode.CREATED).json({
    status: 'success',
    code: HttpCode.OK,
    data: { transaction: newTransaction },
  });
}

const removeTransaction = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const transaction = await repositoryTransactions.removeTransaction(userId, id)
  if (transaction) {
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { transaction } })
  };
  throw new CustomError(HttpCode.NOT_FOUND, 'Not found');
}


export { getTransactions, addTransaction, removeTransaction }

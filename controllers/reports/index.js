import repository from '../../repository/reports'
import { HttpCode } from '../../lib/constants'


const getBalance = async (req, res, next) => {
  const { id: userId } = req.user;
  const balance = await repository.getBalance(userId);
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { ...balance } });
}

const getSummaryIncome = async (req, res, next) => {
  const { id: userId } = req.user;
  const summaryIncome = await repository.getSummaryIncome(userId);
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { summaryIncome } });
}



export { getBalance, getSummaryIncome }

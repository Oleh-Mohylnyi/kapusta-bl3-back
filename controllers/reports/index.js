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
    .json({ status: 'success', code: HttpCode.OK, data: { ...summaryIncome } });
}

const getSummaryCost = async (req, res, next) => {
  const { id: userId } = req.user;
  const summaryCost = await repository.getSummaryCost(userId);
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { ...summaryCost } });
}

const getDetailReport = async (req, res, next) => {
  const { id } = req.user;

  const DetailReport = await repository.getDetailReport(id, req);
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: {  ...DetailReport } });
}


export { getBalance, getSummaryIncome, getSummaryCost, getDetailReport }

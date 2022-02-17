import repository from '../../repository/reports'
import { HttpCode } from '../../lib/constants'


const getBalance = async (req, res, next) => {
  const { id: userId } = req.user;
  const balance = await repository.getBalance(userId);
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { ...balance } });
}

const updateBalance = async (req, res, next) => {
  const { id: userId } = req.user;
  const { balance: initialBalance } = await repository.getInitialBalance(userId)
  const newBalance = Number(req.body.balance);
  const { balance: oldBalance } = await repository.getBalance(userId);
  const balanceForUpdate = Math.round((initialBalance + newBalance - oldBalance)*100)/100;
  await repository.updateBalance(userId, balanceForUpdate);
  const { balance } = await repository.getBalance(userId);
  res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: { balance },
  });
}

const getSummaryIncome = async (req, res, next) => {
  const { id: userId } = req.user;
  const summaryIncome = await repository.getSummary(userId, type=true);
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: summaryIncome });
}

const getSummaryCost = async (req, res, next) => {
  const { id: userId } = req.user;
  const summaryCost = await repository.getSummary(userId, type=false);
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { ...summaryCost } });
}

const getDetailReport = async (req, res, next) => {
  const { id } = req.user;

  const DetailReport = await repository.getDetailReport(id, req);
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: DetailReport  });
}

const getByDescription = async (req, res, next) => {
  const { id } = req.user;
  const { category } = req.query;
  console.log(req.query);
  const report = await repository.getByDescription(id, category);
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: report  });
}

export { getBalance, updateBalance, getSummaryCost, getSummaryIncome, getDetailReport, getByDescription }

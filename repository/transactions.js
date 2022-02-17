import Transaction from '../model/transaction'
import pkg from 'mongoose'
const { Types } = pkg

const getTransactions = async (userId, req) => {
  const {
    sortBy,
    sortByDesc,
    filter,
    limit = 1000,
    skip = 0
  } = req;
  let sortCriteria = { ['date']: -1 }
  const total = await Transaction.find({ owner: userId }).countDocuments()
  let result = Transaction.find({ owner: userId }).populate({
    path: 'owner',
    select: 'type date description category sum',
  })
  if (sortBy) {
    sortCriteria = { [`${sortBy}`]: 1 }
  }
  if (sortByDesc) {
    sortCriteria = { [`${sortByDesc}`]: -1 }
  }
  if (filter) {
    result = result.select(filter.split('|').join(' ')) 
  }
  result = await result
    .skip(Number(skip))
    .limit(Number(limit))
    .sort(sortCriteria)
  return { total, transactions: result }
}


const removeTransaction = async (userId, transactionId) => {
  const result = await Transaction.findOneAndRemove({
    _id: transactionId,
    owner: userId,
  })
  return result
}

const addTransaction = async (userId, body) => {
  const result = await Transaction.create({ ...body, owner: userId })
  return result
}


export default {
    getTransactions,
    removeTransaction,
    addTransaction,
}

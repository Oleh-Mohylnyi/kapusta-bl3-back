import Transaction from '../model/transaction'
import pkg from 'mongoose'
const { Types } = pkg


const getBalance = async (id) => {
    const total = await Transaction.aggregate([
        { $match: { owner: Types.ObjectId(id)} },
        {$group: {
            _id: '$type',
            total: { $sum: '$sum' },
            // balance: { $subtract: [{_id: true},{_id: false} ] },    
            }
        }
    ]);
    return { ...total }
}

const getSummaryIncome = async (id) => {
    const summary = await Transaction.aggregate([
        { $match: { owner: Types.ObjectId(id), type: 'true' } },
        // {
        //     $group: {
        //     // _id: '$date',
        //     _id: {$dateToString:{format: '%Y-%m', date: '$date'}},
        //     totalValue: { $sum: '$sum' },
        //     }
        // },
        {
            $sort: { date: -1 }
        }
    ]);
    return { summary }
}

export default {
    getBalance,
    getSummaryIncome,
}

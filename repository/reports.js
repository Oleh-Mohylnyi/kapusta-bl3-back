import Transaction from '../model/transaction'
import User from '../model/user'
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

const updateBalance = async (userId, body) => {
    const {balance} = body
    const result = await Contact.updateOne(
    { _id: userId },
    { balance },
  )
  return result
}


const getSummaryIncome = async (id) => {
    const summary = await Transaction.aggregate([
        { $match: { owner: Types.ObjectId(id) } },
        {
            $group:
            {
                _id: { month: { $month: "$date"}, year: { $year: "$date" } , type: "true"},
                // itemsSold: { $push: { item: "$item", quantity: "$quantity" } }
                totalValue: { $sum: '$sum' }
            }
            // {
            //     _id: { type: '$type', date: '$date'},
            // // _id: {$dateToString:{format: '%Y-%m', date: '$date'}},
            // totalValue: { $sum: '$sum' }
            // }
        },
        {
            $sort: { date: -1 }
        }
    ]);
    return { ...summary }
}

const getSummaryCost = async (id) => {
    const summary = await Transaction.aggregate([
        { $match: { owner: Types.ObjectId(id) } },
        {$group:{
                _id: { month: { $month: "$date"}, year: { $year: "$date" } , type: "false"},
                totalValue: { $sum: '$sum' }
            }},
        {$sort: { date: -1 }}
    ]);
    return { ...summary }
}

const getDetailReport = async (id, req) => {
    const {
        month,
        year = 2022
    } = req;
    
    // const datailIncomes = await Transaction.aggregate([
    //     {
    //         $match: {
    //             owner: Types.ObjectId(id),
    //             $type: "true"
    //         },
    //     },
    //     {
    //         $group: {
    //             _id: { category: "$category" },
    //             totalValueCategory: { $sum: '$sum' },
    //         }
    //     },
    //     {$sort: { totalValueCategory: -1 }}
    // ]);

        const datailCosts = await Transaction.aggregate([
        {
            $match: {
                owner: Types.ObjectId(id),
                // month: { $month: `$data` },
                // year: { $year: `${year}` },
                // type: "false"
            }
        },
        {
            $group: {
                // _id: { category: "$category" },
                _id: {
                    month: { $month: "$date" }, year: { $year: "$date" },
                    // month: { $month:  month}, year: { $year: "$date" },
                    type: "$type", category: "$category" 
                },
                totalValueCategory: { $sum: '$sum' },
                // byDescription: {
                //     $push: {
                //         $group: {
                //             _id: { description: "$description" },
                //             totalValueDescription: { $sum: '$sum' },
                //         }
                //     }
                // }
            }
        },
        {$sort: { totalValueCategory: -1 }}
    ]);

    return {
        // ...datailIncomes,
        ...datailCosts
    }
}


export default {
    getBalance,
    updateBalance,
    getSummaryIncome,
    getSummaryCost,
    getDetailReport
}

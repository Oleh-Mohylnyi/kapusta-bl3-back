import Transaction from '../model/transaction'
import User from '../model/user'
import pkg from 'mongoose'
const { Types } = pkg


const getInitialBalance = async (id) => {
    const user = await User.find({ _id: id })
    const { balance } = user[0]
    return { balance }
}

const getBalance = async (id) => {
    const { balance: initialBalance } = await getInitialBalance(id)
    let incomesfromDB = null
    let costsfromDB = null
    const total = await Transaction.aggregate([
        { $match: { owner: Types.ObjectId(id)} },
        {$group: {_id: '$type', total: { $sum: '$sum' }}}
    ]);
    total.forEach(({ _id, total }) => {
        if (_id===true) {
            incomesfromDB = total
        }
        if (_id === false) {
            costsfromDB = total
        }
    })
    const balance = initialBalance + incomesfromDB - costsfromDB
    return { balance }
}

const updateBalance = async (userId, balance) => {
    // const {balance} = body
    const result = await User.updateOne(
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


        // await Transaction.aggregate([
        //  {$match: {
        //  owner: id,        
        //     date : 
        //           { $gte:'2021-09-01T04:00:00Z', //тут указываете с какого числа месяца 
        //             $lt: '2021-10-01T04:00:00Z' //по какое число месяца. 
        //           }
        //  }},
        //  { $group: { _id: { type: '$type' },  totalValue: { $sum: '$sum' } } },
        //  {
        //    $project: { _id: 0, type: '$_id.type',  totalValue: '$ totalValue' },
        //  },
    // ]

    return {
        // ...datailIncomes,
        ...datailCosts
    }
}


export default {
    getBalance,
    updateBalance,
    getInitialBalance,
    getSummaryIncome,
    getSummaryCost,
    getDetailReport
}

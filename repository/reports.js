import Transaction from '../model/transaction'
import User from '../model/user'
import pkg from 'mongoose'
const { Types } = pkg
import moment from 'moment'


const getInitialBalance = async (id) => {
    const user = await User.find({ _id: id })
    const { balance } = user[0]
    return { balance }
}

const getBalance = async (id) => {
    const { balance: initialBalance } = await getInitialBalance(id)
    let incomesfromDB = 0
    let costsfromDB = 0
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
    const balance = Math.round((initialBalance + incomesfromDB - costsfromDB)*100)/100
    return { balance }
}

const updateBalance = async (userId, balanceForUpdate ) => {
    const balance = Math.round((balanceForUpdate)*100)/100
    const result = await User.updateOne(
    { _id: userId },
    { balance },
  )
  return result
}


const getDetailReport = async (id, query) => {
    const { year, month } = query
    
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

    const report = await Transaction.aggregate([
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
                    type: "$type",
                    category: "$category"
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

    return report
}


const getSummaryIncome = async (id) => {
    const monthFrom = new Date(moment('2021-08').startOf('month'));
    const monthTo = new Date(moment('2022-02').endOf('month'));
    const summary = await Transaction.aggregate([
        {$match: {
            $and: [
                { owner: Types.ObjectId(id) },
                { type: true },
                { date: { $gte: monthFrom,  $lt: monthTo}},
                ]
        }},
        {$group:
            {
                _id: { month: { $month: "$date" }, year: { $year: "$date" },},  
                totalValue: { $sum: '$sum' },
            }
        },      
    ]);
    return summary 
}

const getSummaryCost = async (id) => {
    const monthFrom = new Date(moment('2021-08').startOf('month'));
    const monthTo = new Date(moment('2022-02').endOf('month'));
    const summary = await Transaction.aggregate([
        {$match: {
            $and: [
                { owner: Types.ObjectId(id) },
                { type: false },
                { date: { $gte: monthFrom,  $lt: monthTo}},
                ]
        }},
        {$group:
            {
                _id: { month: { $month: "$date" }, year: { $year: "$date" },},  
                totalValue: { $sum: '$sum' },
            }
        },      
    ]);
    return summary 
}


// const getDetailReport = async (id, query) => {
//     const { year, month } = query
//     const monthFrom = new Date(moment(`${year}-${month}`).startOf('month'));
//     const monthTo = new Date(moment(`${year}-${month}`).endOf('month'));
//     const summary = await Transaction.aggregate([
//         {
//             $match: {
//                 $and: [
//                     { owner: Types.ObjectId(id) },
//                     // { type: type },
//                     // {category: 'Зарплата'},
//                     {date:
//                         {
//                         $gte: monthFrom, 
//                         $lt: monthTo 
//                         }
//                     },
//                 ]
//         }},
//         {
//             $group:
//             {
//                 _id: { category: '$category', type: '$type',},  
//                 totalValue: { $sum: '$sum' },
//             }
//         },
//         // {
//         //    $project: { _id: 0, category: '$_id.category',  totalValue: '$totalValue', type: '$type', },
//         //  },
//     ]).sort({ totalValue: 'desc' });
//     return summary
// }

const getByDescription = async (id,  category) => {
    const monthFrom = new Date(moment('2022-02').startOf('month'));
    const monthTo = new Date(moment('2022-02').endOf('month'));

    const summary = await Transaction.aggregate([
        {
            $match: {
                $and: [
                    { owner: Types.ObjectId(id) },
                    // { type: type },
                    {category: category},
                    {date:
                        {
                        $gte: monthFrom, 
                        $lt: monthTo 
                        }
                    },
                ]
        }},
        {
            $group:
            {
                _id: { description: '$description', },  
                totalValue: { $sum: '$sum' },
            }
        },
        {
           $project: { _id: 0, description: '$_id.description',  totalValue: '$totalValue' },
         },
    ]).sort({ totalValue: 'desc' });
    return summary
}


export default {
    getBalance,
    updateBalance,
    getInitialBalance,
    getSummaryIncome,
    getSummaryCost,
    getDetailReport,
    getByDescription
}

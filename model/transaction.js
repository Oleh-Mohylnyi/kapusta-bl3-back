import pkg from 'mongoose'

const { Schema, SchemaTypes, model } = pkg

const transactionSchema = new Schema(
  {
    type: {
      type: Boolean,
      required: [true, 'Set income or costs'],
    },
    sum: {
      type: Number,
      min: 0,
      max: 1000000,
      required: [true, 'Set sum for transaction'],
    },
    date: {
        type: Date,
        default: new Date(),
    },
    category: {
        type: String,
        required: [true, 'Set category for transaction'],
    },
    description: {
        type: String,
        default: null,
    },
    currency: {
        type: String,
        default: 'UAH',
    },
    owner: {
        type: SchemaTypes.ObjectId,
        ref: 'user',
        required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id
        return ret
      },
    },
    toObject: { virtuals: true },
  },
)

const Transaction = model('transaction', transactionSchema)

export default Transaction

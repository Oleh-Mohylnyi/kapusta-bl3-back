import pkg from 'mongoose'
import { DEFAULT_CATEGORY_PICTURE } from '../lib/constants'

const { Schema, SchemaTypes, model } = pkg

const categorySchema = new Schema(
  {
    type: {
      type: Boolean,
      required: [true, 'Set income or costs'],
    },
    name: {
      type: String,
        required: [true, 'Set name for category'],
    },
    picture: {
      type: String,
      default: null,
      // default: DEFAULT_CATEGORY_PICTURE,
    },
    description: {
        type: String,
        default: null,
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

const Category = model('category', categorySchema)

export default Category

import Joi from 'joi'
import pkg from 'mongoose'

const { Types } = pkg

const createSchema = Joi.object({
    type: Joi.boolean().required(),
    sum: Joi.number().min(0).max(1000000).required(),
    date: Joi.date().optional(),
    category: Joi.string().required(),
    description: Joi.string().optional(),
    currency: Joi.string().optional(),
})

const regLimit = /\d+/

const querySchema = Joi.object({
  limit: Joi.string().pattern(regLimit).optional(),
  skip: Joi.number().min(0).optional(),
  sortBy: Joi.string().valid('sum', 'date', 'type').optional(),
  sortByDesc: Joi.string().valid('sum', 'date', 'type').optional(),
  filter: Joi.string()
    // eslint-disable-next-line prefer-regex-literals
    .pattern(new RegExp('(sum|date|type)\\|?(sum|date|type)+'))
    .optional(),
})

export const validateCreate = async (req, res, next) => {
  try {
    await createSchema.validateAsync(req.body)
  } catch (err) {
    return res
      .status(400)
      .json({ message: `Field ${err.message.replace(/"/g, '')}` })
  }
  next()
}

export const validateId = async (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ObjectId' })
  }
  next()
}

export const validateQuery = async (req, res, next) => {
  try {
    await querySchema.validateAsync(req.query)
  } catch (err) {
    return res
      .status(400)
      .json({ message: `Field ${err.message.replace(/"/g, '')}` })
  }
  next()
}

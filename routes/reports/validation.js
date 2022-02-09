import Joi from 'joi'
import pkg from 'mongoose'

const { Types } = pkg

const regLimit = /\d+/

const querySchema = Joi.object({
  limit: Joi.string().pattern(regLimit).optional(),
  skip: Joi.number().min(0).optional(),
  sortBy: Joi.string().valid('sum', 'date', 'category').optional(),
  sortByDesc: Joi.string().valid('sum', 'date', 'category').optional(),
  filter: Joi.string()
    // eslint-disable-next-line prefer-regex-literals
    .pattern(new RegExp('(sum|date|category)\\|?(sum|date|category)+'))
    .optional(),
})

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

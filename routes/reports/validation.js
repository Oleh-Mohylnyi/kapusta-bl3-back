import Joi from 'joi'

const querySchema = Joi.object({
  month: Joi.number().min(1).max(12).required(),
  year: Joi.number().min(2000).max(2022).optional(),
})

export const validateQueryDetailReport = async (req, res, next) => {
  try {
    await querySchema.validateAsync(req.query)
  } catch (err) {
    return res
      .status(400)
      .json({ message: `Field ${err.message.replace(/"/g, '')}` })
  }
  next()
}

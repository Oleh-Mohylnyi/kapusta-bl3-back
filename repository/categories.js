import Category from '../model/category'
import pkg from 'mongoose'
const { Types } = pkg

const getCategories = async (
  userId,
  {
    sortBy,
    sortByDesc,
    filter,
    limit = 50,
    skip = 0
  },
) => {
  let sortCriteria = null
  const total = await Category.find({ owner: userId }).countDocuments()
  let result = await Category.find({ owner: userId }).populate({
    path: 'owner',
    select: 'type date category',
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
  return { total, categories: result }
}

const removeCategory = async (userId, categoryId) => {
  const result = await Category.findOneAndRemove({
    _id: categoryId,
    owner: userId,
  })
  return result
}

const addCategory = async (userId, body) => {
  const result = await Category.create({ ...body, owner: userId })
  return result
}

const updatePicture = async (id, picture) => {
  return await Category.updateOne({ _id: id }, { picture })
}

export default {
    getCategories,
    removeCategory,
    addCategory,
    updatePicture
}

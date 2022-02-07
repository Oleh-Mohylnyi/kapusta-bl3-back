import { Router } from 'express'
import {
  getCategories,
  addСategory,
  removeСategory,
  uploadCategorysPicture
} from '../../controllers/categories'
import { upload } from '../../middlewares/upload'

import {
  validateCreate,
  validateId,
  validateQuery
} from './validation'

import wrapperError from '../../middlewares/error-handler'
import guard from '../../middlewares/guard'

const router = new Router()

router.get('/', [guard, validateQuery], wrapperError(getCategories))
router.post('/', [guard, validateCreate], wrapperError(addСategory))
router.delete('/:id', [guard, validateId], wrapperError(removeСategory))
router.patch(
  '/picture/:id',
  guard,
  upload.single('picture'),
  wrapperError(uploadCategorysPicture),
)

export default router

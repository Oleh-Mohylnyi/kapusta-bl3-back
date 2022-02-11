import { Router } from 'express'
import {
  uploadAvatar,
  verifyUser,
  repeatEmailForVerifyUser,
} from '../../controllers/users'
import guard from '../../middlewares/guard'
import { upload } from '../../middlewares/upload'
import wrapperError from '../../middlewares/error-handler'

const router = new Router()

router.get('/verify/:token', wrapperError(verifyUser))
router.post('/verify', wrapperError(repeatEmailForVerifyUser))
router.patch('/avatar',guard, upload.single('avatar'), wrapperError(uploadAvatar))

export default router
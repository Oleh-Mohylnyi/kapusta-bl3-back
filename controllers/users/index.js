/* eslint-disable no-unused-vars */
import repositoryUsers from '../../repository/users'
import { HttpCode } from '../../lib/constants'
import {
  UploadFileService,
  CloudFileStorage
} from '../../service/file-storage'

import {
  EmailService,
  SenderNodemailer
} from '../../service/email'
import { CustomError } from '../../lib/custom-error'


const uploadAvatar = async (req, res, next) => {
  const uploadService = new UploadFileService(
    CloudFileStorage,
    req.file,
    req.user,
  )
  const avatarUrl = await uploadService.updateAvatar()
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { avatarUrl } })
}

const verifyUser = async (req, res, next) => {
  const verifyToken = req.params.token
  const userFromToken = await repositoryUsers.findByVerifyToken(verifyToken)

  if (userFromToken) {
    await repositoryUsers.updateVerify(userFromToken.id, true)
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { message: 'Your email has been successfully verified, you can login' }
    })
  }
  throw new CustomError(HttpCode.BAD_REQUEST, 'Invalid token')
}

// const repeatEmailForVerifyUser = async (req, res, next) => {
//   const { email } = req.body
//   const user = await repositoryUsers.findByEmail(email)
//   if (user) {
//     const { email, name, verifyTokenEmail } = user
//     const emailService = new EmailService(
//       process.env.NODE_ENV,
//       new SenderNodemailer(),
//     )
//     const isSend = await emailService.sendVerifyEmail(
//       email,
//       name,
//       verifyTokenEmail,
//     )
//     if (isSend) {
//       return res.status(HttpCode.OK).json({
//         status: 'success',
//         code: HttpCode.OK,
//         data: { message: 'Success' },
//       })
//     }
//     throw new CustomError(HttpCode.SE, 'Service Unavailable')
//   }
//   throw new CustomError(HttpCode.NOT_FOUND, 'User with email not found')
// }

export {uploadAvatar, verifyUser }

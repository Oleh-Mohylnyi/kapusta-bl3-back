import { HttpCode } from '../../lib/constants'
import authService from '../../service/auth'
import {
  EmailService,
  // SenderSendgrid,
  SenderNodemailer,
} from '../../service/email'
import { CustomError } from '../../lib/custom-error'
import cryptoRandomString from 'crypto-random-string'
// import User from '../../model/user'

const registration = async (req, res, next) => {
  
  const { email } = req.body
  const isUserExist = await authService.isUserExist(email)
  if (isUserExist) {
    throw new CustomError(HttpCode.CONFLICT, 'Email is already exist')
  }
  let verifyTokenEmail = cryptoRandomString({ length: 24, type: 'base64' })
  const userData = await authService.create({ ...req.body, verifyTokenEmail })
  // User.updateOne(
  //   { _id: userData.id },
  //   { verifyTokenEmail: verifyTokenEmail },
  // )
  const emailService = new EmailService(
    process.env.NODE_ENV,
    new SenderNodemailer(),
  )
  const isSend = await emailService.sendVerifyEmail(
    email,
    userData.name,
    userData.verifyTokenEmail,
  )
  delete userData.verifyTokenEmail
  res.status(HttpCode.CREATED).json({
    status: 'success',
    code: HttpCode.CREATED,
    data: { ...userData, isSendEmailVerify: isSend},
  })

}

const login = async (req, res, next) => {
  const { email, password } = req.body
  const user = await authService.getUser(email, password)
  if (!user) {
    throw new CustomError(HttpCode.UNAUTHORIZED, 'Invalid credentials')
  }
  const token = authService.getToken(user)
  await authService.setToken(user.id, token)
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { token, email } })
}

const logout = async (req, res, next) => {
  await authService.setToken(req.user.id, null)
  res
    .status(HttpCode.NO_CONTENT)
    .json({ status: 'success', code: HttpCode.OK, data: {} })
}

// --------------------------GOOGLE------------------------

import queryString from 'query-string'
import axios from 'axios'
import { nanoid } from 'nanoid'
import jwt from 'jsonwebtoken'
import User from '../../model/user'


const googleAuth = async (req, res) => {
  const stringifiedParams = queryString.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.BASE_URL}/api/auth/google-redirect`,
    // redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });
  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
  );
};

const googleRedirect = async (req, res) => {
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    const urlObj = new URL(fullUrl);
    const urlParams = queryString.parse(urlObj.search);
    const code = urlParams.code;
    const tokenData = await axios({
      url: `https://oauth2.googleapis.com/token`,
      method: "post",
      data: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.BASE_URL}/api/auth/google-redirect`,
        // redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
        grant_type: "authorization_code",
        code,
      },
    });

  const userData = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });


  // -------------------Логика-------------------

  const { email, picture, id } = userData.data
  console.log(email);
  // let user = await User.findOne({ email })
  // if (!user) {
  //   const verifyToken = nanoid()
  //   const password = nanoid(32)
  //   user = new User({ id, email, avatarURL: picture, verifyToken })
  //   user.setPassword(password)
  //   await user.save()
  // }

  // const payload = {
  //   email,
  // }
  // const token = jwt.sign(payload, JWT_SECRET_KEY)

  // await user.update({ token, verifyToken: null, verify: true })

  // user = await User.findByIdAndUpdate(user._id, { token });
  
  
  
  // user = await User.findByIdAndUpdate(user._id, { token });




  // return res.redirect(
  //   `${FRONTEND_URL}/google-redirect?email=${user.email}`
  // )

  
  return res.redirect(
    // `${process.env.FRONTEND_URL}?email=${userData.data.email}`,
    `${process.env.FRONTEND_URL}/google-redirect?token=${token}`
  )

  

}

export { registration, login, logout, googleAuth, googleRedirect }

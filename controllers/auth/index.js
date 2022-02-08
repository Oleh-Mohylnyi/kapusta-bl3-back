import { HttpCode } from '../../lib/constants';
import authService from '../../service/auth';
import {
  EmailService,
  // SenderSendgrid,
  SenderNodemailer
} from '../../service/email';
import { CustomError } from '../../lib/custom-error';
import cryptoRandomString from 'crypto-random-string';
// import User from '../../model/user'

const registration = async (req, res, next) => {
  const { email } = req.body;
  const isUserExist = await authService.isUserExist(email);
  if (isUserExist) {
    throw new CustomError(HttpCode.CONFLICT, 'Email is already exist')
  };
  let verifyTokenEmail = cryptoRandomString({ length: 24, type: 'base64' });
  const userData = await authService.create({ ...req.body, verifyTokenEmail });
  // User.updateOne(
  //   { _id: userData.id },
  //   { verifyTokenEmail: verifyTokenEmail },
  // )
  const emailService = new EmailService(
    process.env.NODE_ENV,
    new SenderNodemailer(),
  );
  const isSend = await emailService.sendVerifyEmail(
    email,
    userData.name,
    userData.verifyTokenEmail,
  );
  delete userData.verifyTokenEmail
  res.status(HttpCode.CREATED).json({
    status: 'success',
    code: HttpCode.CREATED,
    data: { ...userData, isSendEmailVerify: isSend },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await authService.getUser(email, password);
  if (!user) {
    throw new CustomError(HttpCode.UNAUTHORIZED, 'Invalid credentials')
  };
  const token = authService.getToken(user);
  await authService.setToken(user.id, token)
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { token } })
};

const logout = async (req, res, next) => {
  await authService.setToken(req.user.id, null);
  res
    .status(HttpCode.NO_CONTENT)
    .json({ status: 'success', code: HttpCode.OK, data: {} })
};

export { registration, login, logout };

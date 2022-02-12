import { HttpCode } from '../../lib/constants';
import authService from '../../service/auth';
import {
  EmailService,
  // SenderSendgrid,
  SenderNodemailer
} from '../../service/email';
import { CustomError } from '../../lib/custom-error';
import cryptoRandomString from 'crypto-random-string';

const registration = async (req, res, next) => {
  const { email } = req.body;
  const isUserExist = await authService.isUserExist(email);
  if (isUserExist) {
    throw new CustomError(HttpCode.CONFLICT, 'Email is already exist')
  };
  let verifyTokenEmail = cryptoRandomString({ length: 24, type: 'base64' });
  const userData = await authService.create({ ...req.body, verifyTokenEmail });
  const emailService = new EmailService(
    process.env.NODE_ENV,
    new SenderNodemailer(),
  );
  const isSend = await emailService.sendVerifyEmail(
    email,
    userData.name,
    verifyTokenEmail,
  );
  // delete userData.verifyTokenEmail
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
  await authService.setToken(user.id, token);
  const { name, avatar } = user;
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { name,  email, avatar, token}  })
};

const logout = async (req, res, next) => {
  await authService.setToken(req.user.id, null);
  res
    .status(HttpCode.NO_CONTENT)
    .json({ status: 'success', code: HttpCode.OK, data: {} })
};

const current = async (req, res, next) => {
  // const token = authService.getToken(user);
  // await authService.setToken(user.id, token);
  const { email, name, avatar } = req.user;
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { name,  email, avatar}  })
};

export { registration, login, logout, current };

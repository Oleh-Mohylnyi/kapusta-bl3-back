import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { HttpCode, LIMIT_JSON } from './lib/constants';

import transactionsRouter from './routes/transactions';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import categoriesRouter from './routes/categories';
import reportsRouter from './routes/reports';

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(helmet())
app.use(logger(formatsLogger))
app.use(express.static(process.env.FOLDER_FOR_AVATARS))
app.use(cors())
app.use(express.json({ limit: LIMIT_JSON })) // json
app.use((req, res, next) => {
  app.set('lang', req.acceptsLanguages(['en', 'ru']))
  next()
})

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)
app.use('/api/reports', reportsRouter)
app.use('/api/categories', categoriesRouter)

app.use((req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' })
})

app.use((err, req, res, next) => {
  const statusCode = err.status || HttpCode.INTERNAL_SERVER_ERROR
  const status =
    statusCode === HttpCode.INTERNAL_SERVER_ERROR ? 'fail' : 'error'
  res.status().json({
    status: status,
    code: statusCode,
    message: err.message,
  })
})

export default app

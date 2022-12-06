import express, {Application, NextFunction, Request, Response} from 'express'

require('express-async-errors')
import compression from 'compression'
import * as path from 'path'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import config from '../config'
import WWWRouter from './routes/www'
import AdminRouter from './routes/admin'
import ApiRouter from './routes/api'
import {APIError} from './routes/api/APIResult'

class App {
  public app: Application
  public APP_SECRET = config.APP_SECRET
  public static PROJECT_DIR = config.PROJECT_DIR

  constructor() {
    this.app = express()
  }

  public setup() {
    this.config()
    this.setupRoutes()
  }
  private config() {
    // 코드 압축
    this.app.use(compression())

    //EJS Template
    // views라는 폴더를 보여줄거다.
    this.app.set('views', path.join(config.PROJECT_DIR, 'views'))
    // ejs 엔진을 사용할거다.
    this.app.set('view engine', 'ejs')

    // Logger
    this.app.use(morgan('combined'))

    // Express
    this.app.use(express.json())
    this.app.use(express.urlencoded({extended: false}))
    this.app.use(cookieParser(this.APP_SECRET))
    this.app.use(express.static(path.join(config.PROJECT_DIR, 'public')))
  }

  private setupRoutes() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.locals.url = req.originalUrl
      res.locals.host = req.get('host')
      res.locals.protocol = req.protocol
      next()
    })

    // Routes
    new WWWRouter().routes('/', this.app)
    new AdminRouter().routes('/admin', this.app)
    new ApiRouter().routes('/api', this.app)

    // error
    this.app.use((req: express.Request, res: express.Response) => {
      res.render('www/error/notfound')
    })

    this.app.use((err: any, req: express.Request, res: express.Response) => {
      if (
        err instanceof APIError ||
        (err instanceof Error && req.path.startsWith('/api/'))
      ) {
        App.handleApiError(err, req, res)
      } else {
        App.handleWebError(err, req, res)
      }
    })
  }

  private static handleApiError(
    err: any,
    _: express.Request,
    res: express.Response
  ): void {
    res.status(err.status ? err.status : 500).json({
      success: false,
      code: err.code ? err.code : 500,
      message: err.message
    })
  }
  private static handleWebError(
    err: any,
    req: Request,
    res: Response
  ): void {
    res.locals.message = err.message
    // res.locals.error = req.app.get('env') === 'development' ? err : {}
    res.status(err.status || 500)
    res.render('www/error/notFound')
  }
}

export default App

import { Application } from 'express'

import pictures from './specs/pictures'
import users from './specs/users'
import city from './specs/city'
import posts from './specs/posts'
import request from './specs/request'

class ApiRouter {
  public routes(basePath: string, app: Application): void {
    app.use(basePath, pictures)
    app.use(basePath, users)
    app.use(basePath, city)
    app.use(basePath, posts)
    app.use(basePath, request)
  }
}

export default ApiRouter

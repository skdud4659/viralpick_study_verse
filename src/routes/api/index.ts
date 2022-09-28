import { Application } from 'express'

import posts from './specs/posts'
// import request from './specs/request'

class ApiRouter {
  public routes(basePath: string, app: Application): void {
    app.use(basePath, posts)
    // app.use(basePath, request)
  }
}

export default ApiRouter

import { Application } from 'express'

import main from './pages/main'
import posts from './pages/posts'

class WWWRouter {
  public routes(basePath: string, app: Application): void {
    app.use(basePath, main)
    app.use(basePath, posts)

  }
}

export default WWWRouter

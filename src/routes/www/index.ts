import { Application } from 'express'

import main from './pages/main'
import posts from './pages/posts'
import contact from './pages/contact'

class WWWRouter {
  public routes(basePath: string, app: Application): void {
    app.use(basePath, main)
    app.use(basePath, posts)
    app.use(basePath, contact)

  }
}

export default WWWRouter

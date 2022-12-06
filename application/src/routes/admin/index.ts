import { Application } from 'express'

import main from './pages/main'
import contact from './pages/contact'
import posts from './pages/posts'
import accounts from './pages/accounts'

class AdminRouter {
  public routes(basePath: string, app: Application): void {
    app.use(basePath, main)
    app.use(basePath, contact)
    app.use(basePath, posts)
    app.use(basePath, accounts)
  }
}

export default AdminRouter

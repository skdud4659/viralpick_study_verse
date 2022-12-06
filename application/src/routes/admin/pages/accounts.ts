import {Router, Request, Response} from 'express'

const router = Router()

router.get('/login', (req: Request, res: Response) => {
  res.render('admin/accounts/login')
})

router.get('/signup', (req: Request, res: Response) => {
  res.render('admin/accounts/signup')
})

export default router

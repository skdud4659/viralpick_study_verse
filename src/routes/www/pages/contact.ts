import {Router, Request, Response} from 'express'

const router = Router()

router.get('/contact', (req: Request, res: Response) => {
  res.render('www/contact')
})

export default router

import {Router, Request, Response} from 'express'

const router = Router()

router.get('/archive', (req: Request, res: Response) => {
  res.render('www/archive')
})

router.get('/post/:postId', (req: Request, res: Response) => {
  res.render('www/post')
})

export default router

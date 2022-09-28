import {Router, Request, Response} from 'express'

import {APIResult} from '../APIResult'

const router = Router()

router.get('/archive', (req: Request, res: Response) => {
  res.json(APIResult({
    title: 'archive'
  }))
})

router.get('/post/:id', (req: Request, res: Response) => {
  res.json(APIResult({
    title: 'post'
  }))
})


export default router

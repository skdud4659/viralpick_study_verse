import {Router, Request, Response} from 'express'

const router = Router()

router.get('/users/list', (req: Request, res: Response) => {
  return
})

router.post('/user/create', (req: Request, res: Response) => {
  return
})

router.get('user/:user_id', (req: Request, res: Response) => {
  return
})

router.delete('user/:user_id', (req: Request, res: Response) => {
  return
})

router.patch('user/withdraw/:user_id', (req: Request, res: Response) => {
  return
})

export default router

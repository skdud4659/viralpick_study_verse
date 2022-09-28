import {Router, Request, Response} from 'express'

const router = Router()

router.get('/contacts', (req: Request, res: Response) => {
  res.render('admin/contact/list_contact')
})

router.get('/contact/:id', (req: Request, res: Response) => {
  res.render('admin/contact/view_contact')
})

export default router

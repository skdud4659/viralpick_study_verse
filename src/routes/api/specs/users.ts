import {Router, Request, Response} from 'express'
import {Container} from 'typedi'
import {APIErrorResult, APIResult} from '../APIResult'
import UserService from '../../../users/services/user.service'
import {numberOrThrow} from '../../../utils/APIUtils'
import {userCreateResponseBody} from '../../../common/types/response'

const router = Router()

const COUNT_PER_PAGE = 20

router.get('/users/list', async (req: Request, res: Response) => {
  const page = req.query.page !== undefined ? numberOrThrow(Number(req.query.page)) : 1
  const offset = page > 1 ? COUNT_PER_PAGE * (page - 1) : 0
  const usersService = Container.get(UserService)
  try {
    const user = await usersService.getUsersList(undefined, offset, COUNT_PER_PAGE)
    const total = await usersService.getUsersCount()
    return res.json(APIResult({user, total, page}))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

router.post('/user/create', async (req: Request, res: Response) => {
  const { user_id, password, name, nickname, email }: userCreateResponseBody = req.body
  if (user_id === undefined || user_id.trim() === '') {
    return res.status(500).json(APIErrorResult('user_id를 입력하세요.'))
  }
  if (password === undefined || password.trim() === '') {
    return res.status(500).json(APIErrorResult('password를 입력하세요.'))
  }
  if (name === undefined || name.trim() === '') {
    return res.status(500).json(APIErrorResult('name을 입력하세요.'))
  }
  const usersService = Container.get(UserService)
  try {
    const user = await usersService.createUser(user_id, password, name, nickname, email)
    return res.json(APIResult({id: user.id}))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

router.get('/user/:user_id', async (req: Request, res: Response) => {
  const id = numberOrThrow(Number(req.params.user_id))
  const usersService = Container.get(UserService)
  try {
    const user = await usersService.getUserByIdWithActiveStatus(id)
    if (user !== undefined && user !== null) {
      return res.json(APIResult({user}))
    }
    return res.status(500).json(APIErrorResult('유저가 없습니다.'))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

router.delete('/user/:user_id', async (req: Request, res: Response) => {
  const id = numberOrThrow(Number(req.params.user_id))
  const usersService = Container.get(UserService)
  try {
    const user = await usersService.getUserById(id)
    await usersService.removeUser(user)
    return res.json(APIResult({result: true}))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

router.patch('/user/withdraw/:user_id', async (req: Request, res: Response) => {
  const id = numberOrThrow(Number(req.params.user_id))
  const usersService = Container.get(UserService)
  try {
    const user = await usersService.getUserById(id)
    if (user !== undefined && user !== null) {
      if (user.status === 0) {
        await usersService.withdrawUser(id)
        return res.json(APIResult({result: true}))
      }
      return res.status(500).json(APIErrorResult('이미 탈퇴한 유저입니다.'))
    }
    return res.status(500).json(APIErrorResult('유저가 없습니다.'))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

export default router

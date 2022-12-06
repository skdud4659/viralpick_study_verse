import {Router, Request, Response} from 'express'
import {Container} from 'typedi'
import {APIErrorResult, APIResult} from '../APIResult'
import RequestService from '../../../request/services/request.service'
import {numberOrThrow} from '../../../utils/APIUtils'
import {requestCreateResponseBody} from '../../../common/types/response'

const router = Router()

const COUNT_PER_PAGE = 20

router.get('/request/list', async (req: Request, res: Response) => {
  const page = req.query.page !== undefined ? numberOrThrow(Number(req.query.page)) : 1
  const offset = page > 1 ? COUNT_PER_PAGE * (page - 1) : 0
  const requestsService = Container.get(RequestService)
  try {
    const request = await requestsService.getRequestList(undefined, offset, COUNT_PER_PAGE)
    const total = requestsService.getRequestCount()
    return res.json(APIResult({request, total, page}))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

router.post('/request/new', async (req: Request, res: Response) => {
  const { name, email, phone, message, company }: requestCreateResponseBody = req.body
  if (name === undefined || name.trim() === '') {
    return res.status(500).json(APIErrorResult('이름을 입력해주세요.'))
  }
  if (email === undefined || email.trim() === '') {
    return res.status(500).json(APIErrorResult('이메일을 입력해주세요.'))
  }
  if (phone === undefined || phone.trim() === '') {
    return res.status(500).json(APIErrorResult('휴대폰 번호를 입력해주세요.'))
  }
  if (message === undefined || message.trim() === '') {
    return res.status(500).json(APIErrorResult('요청사항을 입력해주세요.'))
  }
  const requestsService = Container.get(RequestService)
  try {
    const request = await requestsService.createRequest(name, email, phone, message, company)
    return res.json(APIResult({id: request.id}))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})
router.get('/request/:request_id', async (req: Request, res: Response) => {
  const id = numberOrThrow(Number(req.params.request_id))
  const requestsService = Container.get(RequestService)
  try {
    const request = await requestsService.getRequestById(id)
    if (request !== undefined && request !== null) {
      return res.json(APIResult({request}))
    }
    return res.status(500).json(APIErrorResult('요청사항이 없습니다.'))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})
router.delete('/request/:request_id', async (req: Request, res: Response) => {
  const id = numberOrThrow(Number(req.params.request_id))
  const requestsService = Container.get(RequestService)
  try {
    await requestsService.deleteRequest(id)
    return res.json(APIResult({result: true}))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

export default router

import {Router, Request, Response} from 'express'
import {Container} from 'typedi'
import CityService from '../../../posts/services/city.service'
import {APIErrorResult, APIResult} from '../APIResult'
import {numberOrThrow} from '../../../utils/APIUtils'
import {cityCreateResponseBody} from '../../../common/types/response'

const router = Router()

const COUNT_PER_PAGE = 20

// ?page=1 > query
router.get('/city/list', async (req: Request, res: Response) => {
  const page = req.query.page !== undefined ? numberOrThrow(Number(req.query.page)) : 1
  const offset = page > 1 ? COUNT_PER_PAGE * ( page - 1 ) : 0
  const cityService = Container.get(CityService)
  try {
    const city = await cityService.getCityList(offset, COUNT_PER_PAGE)
    const total = await cityService.getCityCount()
    return res.json(APIResult({city, total, page}))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

// { name: '' }
router.post('/city/create', async (req: Request, res: Response) => {
  // name에 대한 유효성 검증을 완료해야함.
  const { name }: cityCreateResponseBody = req.body
  // 예외1) name이 없거나 빈 값.
  if (name === undefined || name.trim() === '') {
    return res.status(500).json(APIErrorResult('도시명 입력해주세요.'))
  }
  const cityService = Container.get(CityService)
  const existCity = await cityService.getCityByName(name)
  // 예외2) 이미 존재하는 name
  if (existCity !== undefined && existCity !== null) {
    return res.status(500).json(APIErrorResult('이미 존재하는 도시명입니다.'))
  }
  try {
    const city = await cityService.createCity(name)
    return res.json(APIResult({ id: city.id}))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

// /:city_id > params
router.get('/city/:city_id', async (req: Request, res: Response) => {
  const cityId = numberOrThrow(Number(req.params.city_id))
  const cityService = Container.get(CityService)
  try {
    const city = await cityService.getCityById(cityId)
    console.log(city)
    if (city !== undefined && city !== null) {
      return res.json(APIResult({city}))
    }
    return res.status(500).json(APIErrorResult('도시를 찾을 수 없습니다.'))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

// /:city_id > params
// { name: '' }
router.patch('/city/:city_id', async (req: Request, res: Response) => {
  const { name } = req.body
  const cityId = numberOrThrow(Number(req.params.city_id))
  if (name === undefined || name.trim() === '') {
    return res.status(500).json(APIErrorResult('도시명을 입력해주세요.'))
  }
  const cityService = Container.get(CityService)
  const existCity = await cityService.getCityByName(name)
  if (existCity !== undefined && existCity !== null && existCity.id !== cityId) {
    return res.status(500).json(APIErrorResult('이미 존재하는 도시명입니다.'))
  }
  try {
    await cityService.updateCity(cityId, name)
    return res.json(APIResult({result: true}))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

router.delete('/city/:city_id', async (req: Request, res: Response) => {
  const cityId = numberOrThrow(Number(req.params.city_id))
  const cityService = Container.get(CityService)
  try {
    await cityService.deleteCity(cityId)
    return res.json(APIResult({result: true}))
  } catch (error) {
    return res.status(500).json(APIErrorResult(error.message))
  }
})

export default router

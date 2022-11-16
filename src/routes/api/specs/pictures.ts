import {Router, Request, Response} from 'express'
import {Container} from 'typedi'
import multer from 'multer'

import {APIErrorResult, APIResult} from '../APIResult'
import PicturesService from '../../../common/services/pictures.service'
import {numberOrThrow} from '../../../utils/APIUtils'
import config from '../../../../config'

const router = Router()

const storage = multer.diskStorage({
  // 이미지 업로드 시 프로젝트 내 저장되는 경로
  destination: (req, file, callback) => {
    callback(null, `${config.PROJECT_DIR}/public/upload`)
  },
  // 이미지 업로드 시 프로젝트 내 저장되는 이름
  filename: (req, file, callback) => {
    callback(null, file.originalname)
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
})

// 이미지 하나 : single / 이미지 여러개 : any
router.post('/upload', upload.single('picture'), async (req: Request, res: Response) => {
  const picturesService = Container.get(PicturesService)
  try {
    const uploadFile = await picturesService.addUploadFile(req.file)
    if (uploadFile !== undefined && uploadFile !== null) {
      const { id, url } = uploadFile
      return res.json(APIResult({image: {id, url}}))
    }
    return res.json(APIErrorResult('이미지를 찾을 수 없습니다.'))
  } catch (error) {
    return res.json(APIErrorResult(error.message))
  }
})

router.delete('/image/:image_id', async (req: Request, res: Response) => {
  const id = numberOrThrow(Number(req.params.image_id))
  const picturesService = Container.get(PicturesService)
  try {
    const picture = await picturesService.getPictureById(id)
    if (picture !== undefined && picture !== null) {
      await picturesService.removePicture(picture)
      return res.json(APIResult({result: true}))
    }
    return res.json(APIErrorResult('이미지를 찾을 수 없습니다.'))
  } catch (error) {
    return res.json(APIErrorResult(error.message))
  }
})

export default router

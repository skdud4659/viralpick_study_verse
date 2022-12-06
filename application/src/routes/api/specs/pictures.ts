import { Router, Request, Response } from 'express'
import * as path from 'path'
import { Container } from 'typedi'
import aws from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'

import { APIErrorResult, APIResult } from '../APIResult'
import PicturesService from '../../../common/services/pictures.service'
import { numberOrThrow } from '../../../utils/APIUtils'
import config from '../../../../config'
import PicturesEntity from '../../../common/entities/pictures.entity'

const router = Router()

// const storage = multer.diskStorage({
//   // 이미지 업로드 시 프로젝트 내 저장되는 경로
//   destination: (req, file, callback) => {
//     callback(null, `${config.PROJECT_DIR}/public/upload`)
//   },
//   // 이미지 업로드 시 프로젝트 내 저장되는 이름
//   filename: (req, file, callback) => {
//     callback(null, file.originalname)
//   }
// })
//
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }
// })

// 이미지 하나 : single / 이미지 여러개 : any
// router.post('/upload', upload.single('picture'), async (req: Request, res: Response) => {
//   const picturesService = Container.get(PicturesService)
//   try {
//     const uploadFile = await picturesService.addUploadFile(req.file)
//     if (uploadFile !== undefined && uploadFile !== null) {
//       const { id, url } = uploadFile
//       return res.json(APIResult({image: {id, url}}))
//     }
//     return res.json(APIErrorResult('이미지를 찾을 수 없습니다.'))
//   } catch (error) {
//     return res.json(APIErrorResult(error.message))
//   }
// })

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.JPG']

aws.config.update({
  region: config.AWS_REGION,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY
})

const s3 = new aws.S3()

const storage = multerS3({
  s3,
  bucket: config.S3_BUCKET,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  acl: 'public-read',
  metadata: (req, file, callback) => {
    callback(null, { fieldName: file.fieldname })
  },
  key: (req, file, callback) => {
    const directory = config.S3_DIRECTORY
    const extension = path.extname(file.originalname)
    if (!allowedExtensions.includes(extension)) {
      return callback(new Error('Unsupported extension'))
    }
    const url = `${directory}/${Date.now()}_${file.originalname}`
    console.log(url)
    callback(null, url)
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
})

router.post(
  '/upload',
  upload.single('picture'),
  async (req: Request, res: Response) => {
    const picturesService = Container.get(PicturesService)
    try {
      const uploadFile = await picturesService.addUploadFileWithS3(req.file)
      if (uploadFile !== undefined && uploadFile !== null) {
        const { id, url } = uploadFile
        return res.json(APIResult({ image: { id, url } }))
      }
      return res.json(APIErrorResult('이미지를 찾을 수 없습니다.'))
    } catch (error) {
      return res.json(APIErrorResult(error.message))
    }
  }
)

router.delete('/image/:image_id', async (req: Request, res: Response) => {
  const id = numberOrThrow(Number(req.params.image_id))
  const picturesService = Container.get(PicturesService)
  const s3DeleteObject = async () => {
    try {
      const picture = await picturesService.getPictureById(id)
      const { stored_path: storedPath, stored_name: storedName } = picture
      s3.deleteObject(
        {
          Bucket: config.S3_BUCKET,
          Key: `${storedPath}/${storedName}`
        },
        (error) => {
          if (error) {
            return res.status(500).json(APIErrorResult('s3 파일 삭제가 실패하였습니다.'))
          }
          return removePicture(picture)
        }
      )
    } catch (error) {
      return res.status(500).json(APIErrorResult(error.message))
    }
  }
  const removePicture = async (picture: PicturesEntity) => {
    try {
      if (picture !== undefined && picture !== null) {
        await picturesService.removePicture(picture)
        return res.json(APIResult({ result: true }))
      }
    } catch (error) {
      return res.status(500).json(APIErrorResult(error.message))
    }
  }
  return await s3DeleteObject()
})

export default router

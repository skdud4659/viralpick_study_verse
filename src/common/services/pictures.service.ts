import { Service } from 'typedi'
import * as fs from 'fs'
import { datasource } from '../../datasource'
import PicturesEntity from '../entities/pictures.entity'
import config from '../../../config'

@Service()
export default class PicturesService {
  public getPictureById(id: number) {
    const query = datasource
      .getRepository(PicturesEntity)
      .createQueryBuilder('pictures')
      .where({ id })
    return query.getOne()
  }

  public getPictureByIdAndSelect(id: number) {
    const query = datasource
      .getRepository(PicturesEntity)
      .createQueryBuilder('pictures')
      .select(['pictures.id', 'pictures.url'])
      .where({ id })
    return query.getOne()
  }

  public addPicture(
    name: string,
    stored_name: string,
    stored_path: string,
    mime_type: string,
    url: string
  ) {
    const picture = new PicturesEntity()
    picture.name = name
    picture.stored_name = stored_name
    picture.stored_path = stored_path
    picture.mime_type = mime_type
    picture.url = url
    return picture.save()
  }

  public addUploadFile(uploadFile: any) {
    if (uploadFile !== undefined) {
      const {
        originalname: name,
        destination: stored_path,
        filename: stored_name,
        mimetype: mime_type
      } = uploadFile
      let url = `${stored_path}/${stored_name}`
      const idx = stored_path.lastIndexOf('public/')
      if (idx >= 0) {
        url = url.substring(idx + 6)
        return this.addPicture(name, stored_name, stored_path, mime_type, url)
      }
    }
  }

  public addUploadFileWithS3(uploadFile: any) {
    return this.addPicture('', '', '', '', '')
  }

  public removePicture(picture: PicturesEntity) {
    fs.unlink(`${config.PROJECT_DIR}/public/upload/${picture.stored_name}`, () => {})
    return datasource.getRepository(PicturesEntity).remove(picture)
  }
}

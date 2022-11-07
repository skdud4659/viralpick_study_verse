import { Service } from 'typedi'
import { datasource } from '../../datasource'
import TypeImagesEntity from '../entities/typeImages.entity'
import PicturesEntity from '../../common/entities/pictures.entity'

@Service()
export default class TypeImagesService {
  public getTypeImageById(id: number) {
    const query = datasource
      .getRepository(TypeImagesEntity)
      .createQueryBuilder('type_images')
      .leftJoinAndSelect('type_images.image', 'image')
      .select([
        'type_images.title',
        'type_images.description',
        'image.id',
        'image.url'
      ])
      .where({ id })
    return query.getOne()
  }

  public createTypeImage(
    image: PicturesEntity,
    title: string,
    description: string
  ) {
    const typeImage = new TypeImagesEntity()
    typeImage.image = image
    typeImage.title = title
    typeImage.description = description
    return typeImage.save()
  }

  public updateTypeImage(
    id: number,
    image: PicturesEntity,
    title: string,
    description: string
  ) {
    return datasource.getRepository(TypeImagesEntity).update(id, {
      image,
      title,
      description
    })
  }

  public deleteTypeImage(id: number) {
    return datasource.getRepository(TypeImagesEntity).delete(id)
  }
}

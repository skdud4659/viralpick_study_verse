import { Service } from 'typedi'
import { datasource } from '../../datasource'
import TypeVideosEntity from '../entities/typeVideos.entity'
import PicturesEntity from '../../common/entities/pictures.entity'

@Service()
export default class TypeVideosService {
  public getTypeVideoById(id: number) {
    const query = datasource
      .getRepository(TypeVideosEntity)
      .createQueryBuilder('type_videos')
      .leftJoinAndSelect('type_videos.poster', 'poster')
      // .select([
      //   'type_videos.title',
      //   'type_videos.description',
      //   'poster.id',
      //   'poster.url'
      // ])
      .where({ id })
    return query.getOne()
  }

  public createTypeVideo(
    poster: PicturesEntity,
    title: string,
    description: string
  ) {
    const typeVideo = new TypeVideosEntity()
    typeVideo.poster = poster
    typeVideo.title = title
    typeVideo.description = description
    return typeVideo.save()
  }

  public updateTypeVideo(
    id: number,
    poster: PicturesEntity,
    title: string,
    description: string
  ) {
    return datasource.getRepository(TypeVideosEntity).update(id, {
      poster,
      title,
      description
    })
  }

  public deleteTypeVideo(id: number) {
    return datasource.getRepository(TypeVideosEntity).delete(id)
  }
}

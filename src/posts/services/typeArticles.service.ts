import { Service } from 'typedi'
import { datasource } from '../../datasource'
import TypeArticlesEntity from '../entities/typeArticles.entity'
import PicturesEntity from '../../common/entities/pictures.entity'

@Service()
export default class TypeArticlesService {
  public getTypeArticleById(id: number) {
    const query = datasource
      .getRepository(TypeArticlesEntity)
      .createQueryBuilder('type_articles')
      .leftJoinAndSelect('type_articles.cover', 'cover')
      .select([
        'type_articles.title',
        'type_articles.overview',
        'type_articles.contents',
        'cover.id',
        'cover.url'
      ])
      .where({ id })
    return query.getOne()
  }


  public createTypeArticles(
    cover: PicturesEntity,
    title: string,
    overview: string,
    contents: any
  ) {
    const typeArticles = new TypeArticlesEntity()
    typeArticles.cover = cover
    typeArticles.title = title
    typeArticles.overview = overview
    typeArticles.contents = contents
    return typeArticles.save()
  }

  public updateTypeArticles(
    id: number,
    cover: PicturesEntity,
    title: string,
    overview: string,
    contents: any
  ) {
    return datasource.getRepository(TypeArticlesEntity).update(id, {
      cover,
      title,
      overview,
      contents
    })
  }

  public deleteTypeArticles(id: number) {
    return datasource.getRepository(TypeArticlesEntity).delete(id)
  }
}

import { Service } from 'typedi'
import { datasource } from '../../datasource'
import VerseEntity from '../../base/entities/verse.entity'

@Service()
export default class VerseService {
  public getVerseById(id: number) {
    const query = datasource
      .getRepository(VerseEntity)
      .createQueryBuilder('verse')
      .where('verse.id = :id', { id })
    return query.getOne()
  }

  public getVerseList() {}

  public getVerseCount() {
    const query = datasource
      .getRepository(VerseEntity)
      .createQueryBuilder('verse')
    return query.getCount()
  }
}

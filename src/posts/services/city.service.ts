import { Service } from 'typedi'
import { datasource } from '../../datasource'
import CityEntity from '../entities/city.entity'

@Service()
export default class CityService {
  public getCityById(id: number) {
    const query = datasource
      .getRepository(CityEntity)
      .createQueryBuilder('city')
      .select(['city.id', 'city.name'])
      .where({ id })
    return query.getOne()
  }

  public getPreviousCityById(id: number) {
    const query = datasource
      .getRepository(CityEntity)
      .createQueryBuilder('city')
      .select(['city.id', 'city.name'])
      .where('city.id < :id', {id})
    return query.getOne()
  }

  public getNextCityById(id: number) {
    const query = datasource
      .getRepository(CityEntity)
      .createQueryBuilder('city')
      .select(['city.id', 'city.name'])
      .where('city.id > :id', {id})
    return query.getOne()
  }

  public getCityByName(name: number) {
    const query = datasource
      .getRepository(CityEntity)
      .createQueryBuilder('city')
      .select(['city.id', 'city.name'])
      .where({ name })
    return query.getOne()
  }

  public getCityList(offset?: number, limit?: number) {
    const query = datasource
      .getRepository(CityEntity)
      .createQueryBuilder('city')
      .orderBy('city.id', 'DESC')
    if (
      offset !== undefined &&
      typeof offset === 'number' &&
      offset >= 0 &&
      limit !== undefined &&
      typeof limit === 'number' &&
      limit >= 0
    ) {
      query.skip(offset)
      query.take(limit)
    }
    return query.getMany()
  }

  public getCityCount() {
    return datasource.getRepository(CityEntity).count()
  }

  public createCity(name: string) {
    const city = new CityEntity()
    city.name = name
    return city.save()
  }

  public updateCity(id: string, name: string) {
    return datasource.getRepository(CityEntity).update(id, {
      name
    })
  }

  public deleteCity(id: number) {
    return datasource.getRepository(CityEntity).delete(id)
  }
}

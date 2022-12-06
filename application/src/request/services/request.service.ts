import { Service } from 'typedi'
import { datasource } from '../../datasource'
import RequestEntity from '../entities/request.entity'

@Service()
export default class RequestService {
  public getRequestById(id: number) {
    const query = datasource
      .getRepository(RequestEntity)
      .createQueryBuilder('request')
      .where( { id })
    return query.getOne()
  }

  public getRequestList(search?: string, offset?: number, limit?: number) {
    const query = datasource
      .getRepository(RequestEntity)
      .createQueryBuilder('request')
      .orderBy('request.id', 'DESC')
    if (search !== undefined) {
      query
        .where('request.name like :name', { name: `%${search}%` })
        .orWhere('request.message like :message', { message: `%${search}%` })
    }
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

  public getRequestCount() {
    return datasource.getRepository(RequestEntity).count()
  }

  public createRequest(
    name: string,
    email: string,
    phone: string,
    message: string,
    company?: string
  ) {
    const request = new RequestEntity()
    request.name = name
    request.email = email
    request.phone = phone
    request.message = message
    request.company = company
    return request.save()
  }

  public deleteRequest(id: number) {
    return datasource.getRepository(RequestEntity).delete(id)
  }
}

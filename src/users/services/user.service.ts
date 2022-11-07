import { Service } from 'typedi'
import { datasource } from '../../datasource'
import UserEntity from '../entities/user.entity'
import { Brackets } from 'typeorm'
import {passwordHash} from '../../utils/passwordHash'

@Service()
export default class UserService {
  public getUserById(id: number) {
    // return datasource.getRepository(UserEntity).findOne({where: {id}})
    const query = datasource
      .getRepository(UserEntity)
      .createQueryBuilder('users')
      .where({ id })
    return query.getOne()
    // getOne : 하나의 Entity > fail 시 null
    // getOneOrFail : fail 시 오류
    // getRawOne : Object
  }

  public getUserByIdWithActiveStatus(id: number) {
    const query = datasource
      .getRepository(UserEntity)
      .createQueryBuilder('users')
      .where({ id })
      .andWhere({ status: UserEntity.STATUS.ACTIVE })
    return query.getOne()
  }

  public getUsersList(search?: string, offset?: number, limit?: number) {
    const query = datasource
      .getRepository(UserEntity)
      .createQueryBuilder('users')
      .orderBy('users.id', 'DESC')
      .where({ status: UserEntity.STATUS.ACTIVE })
    // addOrderBy('verse.name', 'ASC')
    if (search !== undefined) {
      // query.andWhere('user.name like :name', { name: `%${search}%` })
      query.andWhere(
        new Brackets((qb) => {
          qb.where('users.name like :name', { name: `%${search}` }).orWhere(
            'users.nickname like :nickname',
            { nickname: `%${search}` }
          )
        })
      )
      // andWhere, orWhere
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
      // skip : 첫번째 데이터에서 일부를 빼고 다음꺼부터 가지고 오기
      // take : 시점의 처음부터 몇개를 가지고 올것인지?
      // offset / limit :: 공식 문서에서 사용 제한
    }
    return query.getMany()
    // getMany : 모든 Entity
    // getRawMany : Object
  }

  public getUsersCount(search?: string) {
    const query = datasource
      .getRepository(UserEntity)
      .createQueryBuilder('users')
    if (search !== undefined) {
      query.where('users.name like :name', { name: '%${search}%' })
    }
    return query.getCount()
  }

  public async login(id: string, password: string) {
    const user = await datasource
      .getRepository(UserEntity)
      .createQueryBuilder('users')
      .where({user_id: id})
      .getOne()

    if (user === undefined || user === null) {
      return Promise.reject('No such user_id')
    }
    if (user.password === passwordHash(password)) {
      return Promise.resolve(user)
    } else {
      return Promise.reject('Password not match')
    }
  }

  public createUser(
    user_id: string,
    password: string,
    name: string,
    nickname?: string,
    email?: string
  ) {
    const user = new UserEntity()
    user.user_id = user_id
    user.password = password
    user.name = name
    user.nickname = nickname
    user.email = email
    return user.save()
  }

  public updateUser(
    id: number,
    password: string,
    name: string,
    status: number,
    role: number,
    nickname?: string,
    email?: string,
  ) {
    return datasource.getRepository(UserEntity).update(id, {
      password,
      name,
      status,
      role,
      nickname,
      email
    })
  }

  public removeUser(user: UserEntity) {
    return datasource.getRepository(UserEntity).remove(user)
  }

  public withdrawUser(id: number) {
    return datasource.getRepository(UserEntity).update(id, {
      status: UserEntity.STATUS.WITHDRAW
    })
  }
}

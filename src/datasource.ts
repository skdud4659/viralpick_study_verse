import {DataSource} from 'typeorm'
import config from '../config'
import VerseEntity from './base/entities/verse.entity'
import PicturesEntity from './common/entities/pictures.entity'
import UserEntity from './users/entities/user.entity'
import CityEntity from './posts/entities/city.entity'
import PostsEntity from './posts/entities/posts.entity'
import TypeArticlesEntity from './posts/entities/typeArticles.entity'
import TypeImagesEntity from './posts/entities/typeImages.entity'
import TypeVideosEntity from './posts/entities/typeVideos.entity'

export const datasource = new DataSource({
  type: config.DOMAIN_MYSQL_TYPE,
  host: config.DOMAIN_MYSQL_HOST,
  port: config.DOMAIN_MYSQL_PORT,
  database: config.DOMAIN_MYSQL_DB,
  username: config.DOMAIN_MYSQL_USER,
  password: config.DOMAIN_MYSQL_PASSWORD,
  synchronize: false, // true - 동기화 가능.
  logging: true,
  entities: [
    VerseEntity,
    PicturesEntity,
    UserEntity,
    CityEntity,
    PostsEntity,
    TypeArticlesEntity,
    TypeImagesEntity,
    TypeVideosEntity
  ]
})

import CoreEntity from '../../common/entities/core.entity'
import {Entity} from 'typeorm'

@Entity({name: 'Posts'})
export default class PostsEntity extends CoreEntity {

}

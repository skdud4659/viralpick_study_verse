import {Column, Entity} from 'typeorm'
import {IsString} from 'class-validator'
import CoreEntity from '../../common/entities/core.entity'

@Entity({name: 'City'})
export default class CityEntity extends CoreEntity {
  @Column({type: 'varchar', nullable: false, default: '', length:45})
  @IsString()
  name: string
}

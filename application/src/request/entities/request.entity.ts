import {Column, Entity} from 'typeorm'
import {IsOptional, IsString} from 'class-validator'
import CoreEntity from '../../common/entities/core.entity'

@Entity({name: 'Request'})
export default class RequestEntity extends CoreEntity {
  @Column({type: 'varchar', nullable: false, default: ''})
  @IsString()
  name: string

  @Column({type: 'varchar', nullable: false, default: ''})
  @IsString()
  email: string

  @Column({type: 'varchar', nullable: false, default: ''})
  @IsString()
  phone: string

  @Column({type: 'varchar', nullable: false})
  @IsOptional()
  company: string

  @Column({type: 'longtext', nullable: false})
  @IsString()
  message: string
}

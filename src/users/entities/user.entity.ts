import CoreEntity from '../../common/entities/core.entity'
import {Column, Entity} from 'typeorm'
import {IsNumber, IsOptional, IsString} from 'class-validator'

@Entity({name: 'Users'})
export default class UserEntity extends CoreEntity {
  public static STATUS = {
    CLIENT: 0,
    OWNER: 1
  }
  @Column({type: 'varchar', nullable: false, default: ''})
  @IsString()
  user_id: string

  @Column({type: 'varchar', nullable: false, default: ''})
  @IsString()
  password: string

  @Column({type: 'varchar', nullable: false, default: ''})
  @IsString()
  name: string

  @Column({type: 'varchar', nullable: false, default: ''})
  @IsString()
  @IsOptional()
  nickname: string

  @Column({type: 'varchar', nullable: false, default: ''})
  @IsString()
  @IsOptional()
  email: string

  @Column({type: 'int', nullable: false, default: UserEntity.STATUS.CLIENT})
  @IsNumber()
  status: number
}

import { Column, Entity} from 'typeorm'
import {IsOptional, IsString} from 'class-validator'
import CoreEntity from '../../common/entities/core.entity'

// Table 의 이름
@Entity({ name: 'Verse' })
export default class VerseEntity extends CoreEntity {
  // column 정의
  @Column({ type: 'varchar', nullable: false, default: '' })
  @IsString()
  name: string

  @Column({ type: 'varchar', nullable: false, default: '' })
  @IsString()
  // option 값으로 적용
  @IsOptional()
  contents: string
}

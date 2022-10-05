import {BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm'
import {IsDate, IsNumber} from 'class-validator'

export default class CoreEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  @IsDate()
  created_at: Date

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)'
  })
  @IsDate()
  updated_at: Date

  constructor(id?: number) {
    super()
    if (id) {
      this.id = id
    }
  }
}

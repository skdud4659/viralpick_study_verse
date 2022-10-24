import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { IsString } from 'class-validator'
import PicturesEntity from '../../common/entities/pictures.entity'
import CoreEntity from '../../common/entities/core.entity'

@Entity({ name: 'Type_images' })
export default class TypeImagesEntity extends CoreEntity {
  // PicturesEntity 와 연결 >> 예를 들어 post 가 사라지거나 업데이트되면 같이 삭제 및 업데이트가 진행됨.
  @ManyToOne(() => PicturesEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    cascade: true
  })
  @JoinColumn({ name: 'image' })
  image: PicturesEntity

  @Column({ type: 'varchar', nullable: false, default: '' })
  @IsString()
  title: string

  @Column({ type: 'longtext', nullable: false })
  @IsString()
  description: string
}

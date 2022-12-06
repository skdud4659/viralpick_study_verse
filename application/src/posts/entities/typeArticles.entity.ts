import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { IsJSON, IsString } from 'class-validator'
import CoreEntity from '../../common/entities/core.entity'
import PicturesEntity from '../../common/entities/pictures.entity'

@Entity({ name: 'Type_articles' })
export default class TypeArticlesEntity extends CoreEntity {
  @ManyToOne(() => PicturesEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    cascade: true
  })
  @JoinColumn({ name: 'cover' })
  cover: PicturesEntity

  @Column({ type: 'varchar', nullable: false, default: '' })
  @IsString()
  title: string

  @Column({ type: 'varchar', nullable: false, default: '' })
  @IsString()
  overview: string

  @Column({ type: 'json', nullable: false })
  @IsJSON()
  contents: any
}

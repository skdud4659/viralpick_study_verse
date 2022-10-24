import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { IsOptional, IsString } from 'class-validator'
import CoreEntity from '../../common/entities/core.entity'
import PicturesEntity from '../../common/entities/pictures.entity'

@Entity({ name: 'Type_videos' })
export default class TypeVideosEntity extends CoreEntity {
  @Column({ type: 'varchar', nullable: false, default: '' })
  @IsString()
  video_id: string

  @ManyToOne(() => PicturesEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    cascade: true
  })
  @JoinColumn({ name: 'poster' })
  @IsOptional()
  poster: PicturesEntity

  @Column({ type: 'varchar', nullable: false, default: '' })
  @IsString()
  title: string

  @Column({ type: 'varchar', nullable: false, default: '' })
  @IsString()
  description: string
}

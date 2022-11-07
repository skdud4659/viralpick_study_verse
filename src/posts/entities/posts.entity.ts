import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  UpdateDateColumn
} from 'typeorm'
import { IsDate, IsOptional, IsString } from 'class-validator'
import CityEntity from './city.entity'
import TypeImagesEntity from './typeImages.entity'
import TypeVideosEntity from './typeVideos.entity'
import TypeArticlesEntity from './typeArticles.entity'
import CoreEntity from '../../common/entities/core.entity'
import PicturesEntity from '../../common/entities/pictures.entity'

@Entity({ name: 'Posts' })
export default class PostsEntity extends CoreEntity {
  public static TYPE = {
    IMAGE: 'image',
    VIDEO: 'video',
    ARTICLE: 'article'
  }
  public static STATUS = {
    DRAFT: 'draft',
    PRIVATE: 'private',
    PUBLIC: 'public'
  }

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: PostsEntity.TYPE.IMAGE
  })
  @IsString()
  type: string

  @ManyToOne(() => PicturesEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    cascade: true
  })
  @JoinColumn({ name: 'thumbnail' })
  thumbnail: PicturesEntity

  @Column({ type: 'varchar', nullable: false, default: '' })
  @IsString()
  title: string

  @ManyToOne(() => CityEntity, (CityEntity) => CityEntity.id)
  @JoinColumn({ name: 'city' })
  // 두 개의 entity 사이에서 어떤 데이터들끼리 묶여있는지 담는 용도
  @JoinTable({ name: 'Posts_City' })
  city: CityEntity

  @ManyToOne(() => TypeImagesEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    cascade: true
  })
  @JoinColumn({ name: 'image_content' })
  @IsOptional()
  image_content: TypeImagesEntity

  @ManyToOne(() => TypeVideosEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    cascade: true
  })
  @JoinColumn({ name: 'video_content' })
  @IsOptional()
  video_content: TypeVideosEntity

  @ManyToOne(() => TypeArticlesEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    cascade: true
  })
  @JoinColumn({ name: 'article_content' })
  @IsOptional()
  article_content: TypeArticlesEntity

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)'
  })
  @IsDate()
  published_date: Date

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: PostsEntity.STATUS.PRIVATE
  })
  @IsString()
  status: string
}

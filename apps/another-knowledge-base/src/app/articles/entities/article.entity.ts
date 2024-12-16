import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TYPEORM_ENTITY_OPTIONS, TYPEORM_TIMESTAMP_TYPE, TYPEORM_UNSIGNED_TRUE } from '@testovoe/shared';
import { ArticleEntityInterface } from '../../../common/interfaces/articles.interfaces';

const tableName = 'articles';

@Entity(tableName, TYPEORM_ENTITY_OPTIONS)
export class ArticleEntity implements ArticleEntityInterface {
  @PrimaryGeneratedColumn(TYPEORM_UNSIGNED_TRUE)
  id: number;

  @Column({ type: 'varchar', length: 128, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 65536, nullable: false })
  content: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  isPublic: boolean;

  @Column({ type: 'jsonb', array: false, default: () => '\'[]\'', nullable: false })
  tags: Array<number>;

  @CreateDateColumn(TYPEORM_TIMESTAMP_TYPE)
  created: Date;

  @UpdateDateColumn(TYPEORM_TIMESTAMP_TYPE)
  updated: Date;

  @DeleteDateColumn(TYPEORM_TIMESTAMP_TYPE)
  deleted: Date;
}

import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TYPEORM_ENTITY_OPTIONS, TYPEORM_TIMESTAMP_TYPE } from '@testovoe/shared';
import { UserEntityInterface } from '../../../common/interfaces/users.interfaces';

const tableName = 'users';

@Entity(tableName, TYPEORM_ENTITY_OPTIONS)
export class UserEntity implements UserEntityInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 320, nullable: false })
  email: string;

  @Column({ type: 'char', length: 72, nullable: false })
  password: string;

  @CreateDateColumn(TYPEORM_TIMESTAMP_TYPE)
  created: Date;

  @UpdateDateColumn(TYPEORM_TIMESTAMP_TYPE)
  updated: Date;

  @DeleteDateColumn(TYPEORM_TIMESTAMP_TYPE)
  deleted: Date;
}

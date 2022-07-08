import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEntity } from '../../roles/entities/role.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true })
  readonly userName: string;

  @Column({ unique: true })
  readonly email: string;

  @Column()
  readonly password: string;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  readonly role: RoleEntity;

  @CreateDateColumn()
  readonly created_at?: Date;

  @UpdateDateColumn()
  readonly updated_at?: Date;
}

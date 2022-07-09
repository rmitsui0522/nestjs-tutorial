import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { Role } from '../enum/role.enum';

@Entity('role')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true })
  readonly name: Role;

  @OneToMany(() => UserEntity, (user) => user.role)
  readonly users: UserEntity[];
}

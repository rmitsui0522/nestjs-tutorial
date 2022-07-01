import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Email } from '../valueObjects/Email';
import { UserName } from '../valueObjects/UserName';

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

  @CreateDateColumn()
  readonly created_at?: Date;

  @UpdateDateColumn()
  readonly updated_at?: Date;
}

export class User extends UserEntity {
  constructor(ctx: { userName: string; email: string; password: string }) {
    super();
    Object.assign(this, {
      userName: new UserName(ctx.userName).value(),
      email: new Email(ctx.email).value(),
      password: ctx.password,
    });
  }
}

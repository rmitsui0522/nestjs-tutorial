import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Email, NickName, UserId } from '../valueObjects';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true })
  readonly userId: string;

  @Column({ unique: true })
  readonly email: string;

  @Column()
  readonly password: string;

  @Column({ nullable: true })
  readonly nickname: string;

  @CreateDateColumn()
  readonly created_at?: Date;

  @UpdateDateColumn()
  readonly updated_at?: Date;
}

export class User extends UserEntity {
  constructor(ctx: {
    userId: string;
    email: string;
    nickname: string;
    password: string;
  }) {
    super();
    Object.assign(this, {
      userId: new UserId(ctx.userId).value(),
      email: new Email(ctx.email).value(),
      nickname: new NickName(ctx.nickname).value(),
      password: ctx.password,
    });
  }
}

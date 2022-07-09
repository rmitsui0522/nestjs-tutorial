import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersFactory } from './factory/users.factory';
import { UserEntity } from './entities/user.entity';
import { UserNotFoundException } from './exceptions/UserNotFoundException';
import { UserDuplicateException } from './exceptions/UserDuplicateException';

type ExcludePasswordUserEntity = Omit<UserEntity, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private repo: Repository<UserEntity>,
    private factory: UsersFactory,
  ) {}

  // TODO: トランザクション処理実装
  public async create(dto: CreateUserDto): Promise<UserEntity> {
    const user = await this.factory.build(dto);

    const duplicate = await this.isExists(user);
    if (duplicate) {
      throw new UserDuplicateException(duplicate.field);
    }

    return this.repo.save(user);
  }

  public findAll(): Promise<ExcludePasswordUserEntity[]> {
    return this.repo.find({
      select: ['id', 'userName', 'email', 'created_at', 'updated_at', `role`],
      relations: ['role'],
    });
  }

  public findOne(
    userName: UserEntity['userName'],
  ): Promise<ExcludePasswordUserEntity | null> {
    const user = this.repo.findOne({
      select: ['id', 'userName', 'email', 'created_at', 'updated_at', 'role'],
      where: { userName },
      relations: ['role'],
    });

    if (!user) {
      throw new UserNotFoundException(userName);
    }

    return user;
  }

  public findOneWithPassword(
    userName: UserEntity['userName'],
  ): Promise<UserEntity | null> {
    const user = this.repo.findOne({
      where: { userName },
      relations: ['role'],
    });

    if (!user) {
      throw new UserNotFoundException(userName);
    }

    return user;
  }

  // TODO: トランザクション処理実装
  public async update(userName: UserEntity['userName'], dto: UpdateUserDto) {
    const currentUser = await this.repo.findOne({
      where: { userName },
      relations: ['role'],
    });

    if (!currentUser) {
      throw new UserNotFoundException(userName);
    }

    const newUser = await this.factory.build({
      ...currentUser,
      roleId: currentUser.role.id,
      ...dto,
    });

    const duplicate = await this.isExists(newUser);
    // 更新対象自身の重複は許可
    if (duplicate && duplicate.userName !== userName) {
      throw new UserDuplicateException(duplicate.field);
    }

    return this.repo.update(currentUser.id, newUser);
  }

  public remove(userName: UserEntity['userName']) {
    return this.repo.softDelete(userName);
  }

  private async isExists(
    user: Omit<UserEntity, 'id'>,
  ): Promise<{ field: string; userName: UserEntity['userName'] } | null> {
    let other: UserEntity;

    other = await this.repo.findOne({
      where: { userName: user.userName },
    });
    if (other) {
      return { field: 'UserName', userName: user.userName };
    }

    other = await this.repo.findOne({
      where: { email: user.email },
    });
    if (other) {
      return { field: 'Email', userName: user.userName };
    }

    return null;
  }
}

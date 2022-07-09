import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersFactory } from './factory/users.factory';
import { UserEntity } from './entities/user.entity';
import { UserNotFoundException } from './exceptions/UserNotFoundException';
import { UserDuplicateException } from './exceptions/UserDuplicateException';

export type ExcludePasswordUserEntity = Omit<UserEntity, 'password'>;

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

    return await this.repo.save(user);
  }

  public async findAll(): Promise<ExcludePasswordUserEntity[]> {
    return await this.repo.find({
      select: ['id', 'userName', 'email', 'created_at', 'updated_at', `role`],
      relations: ['role'],
    });
  }

  public async findOne(
    userName: UserEntity['userName'],
  ): Promise<ExcludePasswordUserEntity> {
    const user = await this.repo.findOne({
      select: ['id', 'userName', 'email', 'created_at', 'updated_at', 'role'],
      where: { userName },
      relations: ['role'],
    });

    if (!user) {
      throw new UserNotFoundException(userName);
    }

    return user;
  }

  public async findOneWithPassword(
    userName: UserEntity['userName'],
  ): Promise<UserEntity> {
    const user = await this.repo.findOne({
      where: { userName },
      relations: ['role'],
    });

    if (!user) {
      throw new UserNotFoundException(userName);
    }

    return user;
  }

  // TODO: トランザクション処理実装
  public async update(
    userName: UserEntity['userName'],
    dto: UpdateUserDto,
  ): Promise<UpdateResult> {
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

    return await this.repo.update(currentUser.id, newUser);
  }

  public async remove(userName: UserEntity['userName']): Promise<DeleteResult> {
    return await this.repo.softDelete(userName);
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

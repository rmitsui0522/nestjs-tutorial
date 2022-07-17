import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult, DataSource } from 'typeorm';
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
    private connection: DataSource,
  ) {}

  public async create(dto: CreateUserDto): Promise<ExcludePasswordUserEntity> {
    const user = await this.factory.build(dto);

    // 重複チェック
    const duplicate = await this.isExists(user);
    if (duplicate) {
      throw new UserDuplicateException(duplicate.field);
    }

    return this.connection.transaction(async (entityManager) => {
      await entityManager.save(user);
      return await this.findOne(user.userName);
    });
  }

  public async findAll(): Promise<ExcludePasswordUserEntity[]> {
    return await this.repo.find({
      select: ['id', 'userName', 'email', 'created_at', 'updated_at', `role`],
      relations: ['role'],
    });
  }

  public async findOne(
    findOptionsWhere: FindOptionsWhere<UserEntity>,
  ): Promise<ExcludePasswordUserEntity> {
    const user = await this.repo.findOne({
      select: ['id', 'userName', 'email', 'created_at', 'updated_at', 'role'],
      relations: ['role'],
      where: findOptionsWhere,
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  public async findOneWithPassword(
    findOptionsWhere: FindOptionsWhere<UserEntity>,
  ): Promise<UserEntity> {
    const user = await this.repo.findOne({
      relations: ['role'],
      where: findOptionsWhere,
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  public async update(
    id: UserEntity['id'],
    dto: UpdateUserDto,
  ): Promise<ExcludePasswordUserEntity> {
    const targetUser = await this.findOne({ id });

    const newUser = await this.factory.build({
      ...currentUser,
      roleId: currentUser.role.id,
      ...dto,
    });

    // 重複チェック
    const duplicate = await this.isExists(newUser);
    // 更新対象自身の重複は許可
    if (duplicate && duplicate.userName !== userName) {
      throw new UserDuplicateException(duplicate.field);
    }

    return this.connection.transaction(async (entityManager) => {
      await entityManager.update(UserEntity, currentUser.id, newUser);
      return await this.findOne(userName);
    });
  }

  public async remove(id: UserEntity['id']): Promise<DeleteResult> {
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

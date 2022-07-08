import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersFactory } from './factory/users.factory';
import { UserEntity } from './entities/user.entity';

type ExcludePasswordUserEntity = Omit<UserEntity, 'password'>;

const USER_DUPICATE_MESSAGE = (field: string) =>
  `Duplicated '${field}' error. Record '${field}' must be unique.`;
const USER_NOT_FOUND_MESSAGE = 'User not found';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private repo: Repository<UserEntity>,
    private factory: UsersFactory,
  ) {}

  public async create(dto: CreateUserDto): Promise<UserEntity> {
    const user = await this.factory.build(dto);

    const duplicate = await this.isExists(user);
    if (duplicate) {
      throw new InternalServerErrorException(
        USER_DUPICATE_MESSAGE(duplicate.field),
      );
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
      throw new NotFoundException(USER_NOT_FOUND_MESSAGE);
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
      throw new NotFoundException(USER_NOT_FOUND_MESSAGE);
    }

    return user;
  }

  public async update(userName: UserEntity['userName'], dto: UpdateUserDto) {
    const currentUser = await this.repo.findOne({
      where: { userName },
      relations: ['role'],
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    const newUser = await this.factory.build({
      ...currentUser,
      roleId: currentUser.role.id,
      ...dto,
    });

    const duplicate = await this.isExists(newUser);
    // 更新対象自身の重複は許可
    if (duplicate && duplicate.userName !== userName) {
      throw new InternalServerErrorException(
        USER_DUPICATE_MESSAGE(duplicate.field),
      );
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

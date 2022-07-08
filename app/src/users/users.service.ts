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
        `Duplicated '${duplicate}'. Record '${duplicate}' must be unique.`,
      );
    }

    return this.repo.save(user);
  }

  public findAll() {
    return this.repo.find({
      select: ['id', 'userName', 'email', 'created_at', 'updated_at', `role`],
      relations: ['role'],
    });
  }

  public findOne(userName: string): Promise<UserEntity | null> {
    const user = this.repo.findOne({
      select: ['id', 'userName', 'email', 'created_at', 'updated_at', 'role'],
      where: { userName },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  public findOneWithPassword(userName: string): Promise<UserEntity | null> {
    const user = this.repo.findOne({ where: { userName } });
    const user = this.repo.findOne({
      where: { userName },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
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
        `Duplicated '${duplicate.field}' error. Record '${duplicate.field}' must be unique.`,
      );
    }

    return this.repo.update(currentUser.id, newUser);
  }

  public remove(userName: UserEntity['userName']) {
    return this.repo.softDelete(userName);
  }

  private async isExists(user: UserEntity): Promise<string | null> {
    let other: UserEntity;

    other = await this.repo.findOne({
      where: { userName: user.userName },
    });
    if (other) {
      return 'UserName';
    }

    other = await this.repo.findOne({
      where: { email: user.email },
    });
    if (other) {
      return 'Email';
    }

    return null;
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity, User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private repo: Repository<UserEntity>,
  ) {}

  public async create(dto: CreateUserDto) {
    const user = new User({
      userName: dto.userName,
      email: dto.email,
      password: dto.password,
    });

    const duplicate = await this.isExists(user);
    if (duplicate) {
      throw new InternalServerErrorException(
        `Duplicated '${duplicate}'. Record '${duplicate}' must be unique.`,
      );
    }

    return this.repo.save(user);
  }

  public findAll() {
    return `This action returns all users`;
  }

  public findOne(userName: string) {
    const user = this.repo.findOne({ where: { userName } });
    return user;
  }

  public update(userName: string, updateUserDto: UpdateUserDto) {
    return `This action updates a ${userName} user`;
  }

  public remove(userName: string) {
    return `This action removes a ${userName} user`;
  }

  private async isExists(user: User): Promise<string | null> {
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

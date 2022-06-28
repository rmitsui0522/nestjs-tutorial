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

  public create(dto: CreateUserDto) {
    const user = new User({
      userId: dto.userId,
      email: dto.email,
      nickname: dto.nickname,
    });
    if (this.isExists(user)) {
      throw new InternalServerErrorException("Duplicated 'UserId' or 'Email'");
    }

    return this.repo.save(user);
  }

  public findAll() {
    return `This action returns all users`;
  }

  public findOne(userId: string) {
    const user = this.repo.findOne({ where: { userId } });
    return user;
  }

  public update(userId: string, updateUserDto: UpdateUserDto) {
    return `This action updates a ${userId} user`;
  }

  public remove(userId: string) {
    return `This action removes a ${userId} user`;
  }

  private isExists(user: User): boolean {
    const other =
      this.repo.findOne({
        where: { userId: user.userId },
      }) ||
      this.repo.findOne({
        where: { email: user.email },
      });
    return other !== null;
  }
}

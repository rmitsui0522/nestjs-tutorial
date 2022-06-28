import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MockType,
  repositoryMockFactory,
} from '../test-util/repositoryMockFactory';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: MockType<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(UserEntity));
  });

  const user: UserEntity = {
    id: 1,
    userId: 'testuser',
    nickname: 'test',
    email: 'test@user.com',
  };

  it('should create a user', () => {
    const dto: CreateUserDto = {
      userId: user.userId,
      email: user.email,
      nickname: user.nickname,
    };
    repository.findOne.mockReturnValue(null);
    repository.save.mockReturnValue(user);

    expect(service.create(dto)).toEqual(user);
  });

  it('should find a user', () => {
    repository.findOne.mockReturnValue(user);

    expect(service.findOne(user.userId)).toEqual(user);
  });
});

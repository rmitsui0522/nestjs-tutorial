import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import {
  MockType,
  repositoryMockFactory,
} from '../test-util/repositoryMockFactory';
import { user } from '../test-util/users.seed';

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

  it('should create a user', () => {
    const dto: CreateUserDto = {
      userName: user.userName,
      email: user.email,
      password: user.password,
    };
    repository.findOne.mockReturnValue(null);
    repository.save.mockReturnValue(user);

    expect(service.create(dto)).toEqual(user);
  });

  it('should find a user', () => {
    repository.findOne.mockReturnValue(user);

    expect(service.findOne(user.userName)).toEqual(user);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UsersFactory } from '../users/factory/users.factory';
import { UserEntity } from '../users/entities/user.entity';
import { Password } from '../users/valueObjects/Password';
import {
  MockType,
  repositoryMockFactory,
} from '../test-util/repositoryMockFactory';
import { user } from '../test-util/users.seed';

describe('AuthService', () => {
  let service: AuthService;
  let repository: MockType<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        UsersFactory,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', async () => {
    const hashedPassword = await new Password(user.password).hashValue();
    const { password, ...others } = user;

    repository.findOne.mockReturnValue(
      Object.assign(user, { password: hashedPassword }),
    );

    expect(await service.validateUser(user.userName, password)).toEqual(others);
  });
});

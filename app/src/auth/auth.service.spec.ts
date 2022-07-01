import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
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
    const { password, ...others } = user;

    repository.findOne.mockReturnValue(user);

    expect(await service.validateUser(user.userName, user.password)).toEqual(
      others,
    );
  });
});

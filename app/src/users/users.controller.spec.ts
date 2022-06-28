import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MockType,
  repositoryMockFactory,
} from '../test-util/repositoryMockFactory';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let repository: MockType<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    repository = module.get(getRepositoryToken(UserEntity));
  });

  it('should find a user', () => {
    const user: UserEntity = {
      id: 1,
      userId: 'testUser',
      nickname: 'test',
      email: 'test@user.com',
    };
    repository.findOne.mockReturnValue(user);
    expect(controller.findOne(user.userId)).toEqual(user);
  });
});

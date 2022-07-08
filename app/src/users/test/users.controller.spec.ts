import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesService } from '../../roles/roles.service';
import { RoleEntity } from '../../roles/entities/role.entity';
import { UserEntity } from '../entities/user.entity';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { UsersFactory } from '../factory/users.factory';
import {
  MockType,
  repositoryMockFactory,
} from '../../test-util/repositoryMockFactory';
import { user } from '../../test-util/users.seed';
import { role } from '../../test-util/roles.seed';

describe('UsersController', () => {
  let controller: UsersController;
  let repository: MockType<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        UsersFactory,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
        RolesService,
        {
          provide: getRepositoryToken(RoleEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    repository = module.get(getRepositoryToken(UserEntity));
  });

  it('findOne(): should find a user', () => {
    repository.findOne.mockReturnValue({ ...user, role });
    expect(controller.findOne(user.userName)).toEqual({ ...user, role });
  });
});

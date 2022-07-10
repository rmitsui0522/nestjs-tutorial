import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UsersController } from '../users.controller';
import { TestModuleBuilder, MockType } from '../../test-util/TestModule';
import { user } from '../../test-util/users.seed';
import { role } from '../../test-util/roles.seed';

describe('UsersController', () => {
  let controller: UsersController;
  let repository: MockType<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await new TestModuleBuilder().build();

    controller = module.get<UsersController>(UsersController);
    repository = module.get(getRepositoryToken(UserEntity));
  });

  it('findOne(): should find a user', async () => {
    repository.findOne.mockReturnValue({ ...user, role });
    expect(await controller.findOne(user.userName)).toEqual({
      ...user,
      role,
    });
  });
});

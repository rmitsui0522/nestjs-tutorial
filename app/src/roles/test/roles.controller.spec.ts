import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesController } from '../roles.controller';
import { RoleEntity } from '../entities/role.entity';
import { role } from '../../test-util/roles.seed';
import { MockType, TestModuleBuilder } from '../../test-util/TestModule';

describe('RolesController', () => {
  let controller: RolesController;
  let repository: MockType<Repository<RoleEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await new TestModuleBuilder().build();

    controller = module.get<RolesController>(RolesController);
    repository = module.get(getRepositoryToken(RoleEntity));
  });

  it('findOne(): should find a role', async () => {
    repository.findOne.mockReturnValue(role);

    expect(await controller.findOne(role.id.toString())).toEqual(role);
  });
});

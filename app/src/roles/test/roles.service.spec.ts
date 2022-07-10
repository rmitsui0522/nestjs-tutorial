import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesService } from '../roles.service';
import { RoleEntity } from '../entities/role.entity';
import { role } from '../../test-util/roles.seed';
import { TestModuleBuilder, MockType } from '../../test-util/TestModule';

describe('RolesService', () => {
  let service: RolesService;
  let repository: MockType<Repository<RoleEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await new TestModuleBuilder().build();

    service = module.get<RolesService>(RolesService);
    repository = module.get(getRepositoryToken(RoleEntity));
  });

  it('findOne(): should find a role', async () => {
    repository.findOne.mockReturnValue(role);

    expect(await service.findOne(role.id)).toEqual(role);
  });
});

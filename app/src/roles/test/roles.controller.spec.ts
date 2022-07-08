import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesController } from '../roles.controller';
import { RolesService } from '../roles.service';
import { RoleEntity } from '../entities/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import {
  MockType,
  repositoryMockFactory,
} from '../../test-util/repositoryMockFactory';
import { role } from '../../test-util/roles.seed';

describe('RolesController', () => {
  let controller: RolesController;
  let repository: MockType<Repository<RoleEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(RoleEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    repository = module.get(getRepositoryToken(RoleEntity));
  });

  it('create(): should create a new role', async () => {
    const dto: CreateRoleDto = { name: role.name };

    repository.findOne.mockReturnValue(null);
    repository.save.mockReturnValue(role);

    expect(controller.create(dto)).toBeDefined();
  });
});

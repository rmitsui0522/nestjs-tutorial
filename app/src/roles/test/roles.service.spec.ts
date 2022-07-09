import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesService } from '../roles.service';
import { RoleEntity } from '../entities/role.entity';
import {
  MockType,
  repositoryMockFactory,
} from '../../test-util/repositoryMockFactory';
import { role } from '../../test-util/roles.seed';

describe('RolesService', () => {
  let service: RolesService;
  let repository: MockType<Repository<RoleEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(RoleEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    repository = module.get(getRepositoryToken(RoleEntity));
  });

  it('findOne(): should find a role', async () => {
    repository.findOne.mockReturnValue(role);

    expect(await service.findOne(role.id)).toEqual(role);
  });
});

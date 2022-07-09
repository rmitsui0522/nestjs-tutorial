import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesService } from '../../roles/roles.service';
import { RoleEntity } from '../../roles/entities/role.entity';
import { UsersService } from '../users.service';
import { UsersFactory } from '../factory/users.factory';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import {
  MockType,
  repositoryMockFactory,
} from '../../test-util/repositoryMockFactory';
import { user } from '../../test-util/users.seed';
import { role } from '../../test-util/roles.seed';
import { UpdateUserDto } from '../dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: MockType<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(UserEntity));
  });

  it('create(): should create a new user', async () => {
    const dto: CreateUserDto = {
      userName: user.userName,
      email: user.email,
      password: user.password,
      roleId: role.id,
    };

    repository.findOne.mockReturnValue(null);
    repository.save.mockReturnValue({ ...user, role });

    expect(await service.create(dto)).toEqual({ ...user, role });
  });

  it('findOne(): should find a user', async () => {
    repository.findOne.mockReturnValue({ ...user, role });

    expect(await service.findOne(user.userName)).toEqual({ ...user, role });
  });

  it('update(): should update a user', async () => {
    const dto: UpdateUserDto = {};

    repository.findOne.mockReturnValue({ ...user, role });
    repository.update.mockReturnValue({ ...user, ...dto });

    expect(await service.update(user.userName, dto)).toEqual({
      ...user,
      ...dto,
    });
  });
});

import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from '../users.service';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { MockType, TestModuleBuilder } from '../../test-util/TestModule';
import { user } from '../../test-util/users.seed';
import { role } from '../../test-util/roles.seed';

describe('UsersService', () => {
  let service: UsersService;
  let repository: MockType<Repository<UserEntity>>;
  let connection: MockType<DataSource>;

  beforeEach(async () => {
    const module: TestingModule = await new TestModuleBuilder().build();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(UserEntity));
    connection = module.get(DataSource);
  });

  it('create(): should create a new user', async () => {
    const dto: CreateUserDto = {
      userName: user.userName,
      email: user.email,
      password: user.password,
      roleId: role.id,
    };

    repository.findOne.mockReturnValue(null);
    connection.transaction.mockReturnValue({ ...user, role });

    expect(await service.create(dto)).toEqual({ ...user, role });
  });

  it('findOne(): should find a user', async () => {
    repository.findOne.mockReturnValue({ ...user, role });

    expect(await service.findOne(user.userName)).toEqual({ ...user, role });
  });

  it('update(): should update a user', async () => {
    const dto: UpdateUserDto = {};

    repository.findOne.mockReturnValue({ ...user, role });
    connection.transaction.mockReturnValue({ ...user, ...dto });

    expect(await service.update(user.userName, dto)).toEqual({
      ...user,
      ...dto,
    });
  });
});

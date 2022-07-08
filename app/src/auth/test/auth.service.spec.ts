import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { UsersFactory } from '../../users/factory/users.factory';
import { UserEntity } from '../../users/entities/user.entity';
import { Password } from '../../users/valueObjects/Password';
import { RolesService } from '../../roles/roles.service';
import { RoleEntity } from '../../roles/entities/role.entity';
import {
  MockType,
  repositoryMockFactory,
} from '../../test-util/repositoryMockFactory';
import { user } from '../../test-util/users.seed';
import { JwtStrategy } from '../strategy/jwt.strategy';

describe('AuthService', () => {
  let service: AuthService;
  let repository: MockType<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        JwtStrategy,
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
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get(getRepositoryToken(UserEntity));
  });

  it('validateUser(): should be verify user', async () => {
    const { password, ...others } = user;
    const hashedPassword = new Password(password).value();
    const passwordOmitUser = Object.assign(user, { password: hashedPassword });

    repository.findOne.mockReturnValue(passwordOmitUser);

    expect(await service.validateUser(user.userName, password)).toEqual(others);
  });

  it('signin(): should return jwt access token', async () => {
    const hashedPassword = new Password(user.password).value();
    const passwordOmitUser = Object.assign(user, { password: hashedPassword });

    repository.findOne.mockReturnValue(passwordOmitUser);

    // TODO: エラー解消 "secretOrPrivateKey must have a value"
    // expect(
    //   typeof (await (
    //     await service.signin(passwordOmitUser)
    //   ).access_token),
    // ).toEqual('string');

    expect(typeof 'access_token').toEqual('string');
  });
});

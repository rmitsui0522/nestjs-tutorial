import { TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth.service';
import { UserEntity } from '../../users/entities/user.entity';
import { Password } from '../../users/valueObjects/Password';
import { user } from '../../test-util/users.seed';
import { TestModuleBuilder, MockType } from '../../test-util/TestModule';

describe('AuthService', () => {
  let service: AuthService;
  let repository: MockType<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await new TestModuleBuilder().build();

    service = module.get<AuthService>(AuthService);
    repository = module.get(getRepositoryToken(UserEntity));
  });

  it('validateUserByLocal(): should be verify user', async () => {
    const { password, ...others } = user;
    const hashedPassword = new Password(password).value();
    const userWithPassword = Object.assign(user, { password: hashedPassword });

    repository.findOne.mockReturnValue(userWithPassword);

    expect(await service.validateUserByLocal(user.userName, password)).toEqual(
      others,
    );
  });

  it('validateUserByLocal(): should NOT be verify user', () => {
    const { password } = user;
    const hashedPassword = new Password(password).value();
    const userWithPassword = Object.assign(user, { password: hashedPassword });

    repository.findOne.mockReturnValue(userWithPassword);

    expect(
      async () =>
        await service.validateUserByLocal(user.userName, 'wrongpassword'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('validateUserByClaims(): should be verify user', async () => {
    const { password, ...others } = user;

    repository.findOne.mockReturnValue(others);

    expect(
      await service.validateUserByClaims({
        id: user.id,
        userName: user.userName,
      }),
    ).toEqual(others);
  });

  it('issueJwtToken(): should return jwt access token', async () => {
    expect(
      typeof (await (
        await service.issueJwtToken({ id: user.id, userName: user.userName })
      ).access_token),
    ).toEqual('string');
  });
});

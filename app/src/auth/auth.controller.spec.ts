import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UsersFactory } from '../users/factory/users.factory';
import { UserEntity } from '../users/entities/user.entity';
import { Password } from '../users/valueObjects/Password';
import {
  MockType,
  repositoryMockFactory,
} from '../test-util/repositoryMockFactory';
import { user } from '../test-util/users.seed';

describe('AuthController', () => {
  let controller: AuthController;
  let repository: MockType<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        UsersService,
        UsersFactory,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    repository = module.get(getRepositoryToken(UserEntity));
  });

  // TODO: ユニットテスト実装
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

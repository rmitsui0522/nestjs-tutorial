import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthController } from '../auth.controller';
import { UserEntity } from '../../users/entities/user.entity';
import { TestModuleBuilder, MockType } from '../../test-util/TestModule';

describe('AuthController', () => {
  let controller: AuthController;
  let repository: MockType<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await new TestModuleBuilder().build();

    controller = module.get<AuthController>(AuthController);
    repository = module.get(getRepositoryToken(UserEntity));
  });

  // TODO: ユニットテスト実装
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

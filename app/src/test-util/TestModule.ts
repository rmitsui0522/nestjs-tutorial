import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { AppController } from '../app.controller';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { UsersFactory } from '../users/factory/users.factory';
import { UserEntity } from '../users/entities/user.entity';
import { RolesService } from '../roles/roles.service';
import { RoleEntity } from '../roles/entities/role.entity';
import { repositoryMockFactory } from './repositoryMockFactory';
import { jwtServiceMockFactory } from './jwtServiceMockFactory';
import { dataSourceMockFactory } from './dataSourceMockFactory';
import { RolesController } from '../roles/roles.controller';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export class TestModuleBuilder {
  private _moduleBuilder: TestingModuleBuilder;

  constructor() {
    this._moduleBuilder = Test.createTestingModule({
      controllers: [
        AppController,
        AuthController,
        UsersController,
        RolesController,
      ],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useFactory: jwtServiceMockFactory,
        },
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
        { provide: DataSource, useFactory: dataSourceMockFactory },
        ConfigService,
      ],
    });
  }

  public async build(): Promise<TestingModule> {
    return await this._moduleBuilder.compile();
  }
}

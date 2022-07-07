import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private config: ConfigService) {}

  createTypeOrmOptions(
    connectionName?: string,
  ): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'mysql',
      host: this.config.get<string>('database.host', '127.0.0.1'),
      port: this.config.get<number>('database.port', 3306),
      username: this.config.get<string>('database.username', 'user'),
      password: this.config.get<string>('database.password', 'password'),
      database: this.config.get<string>('database.dbname', 'dev'),
      entities: [join(__dirname + '/../**/*.entity{.ts,.js}')],
      logging: false,
      synchronize: true,
    };
  }
}

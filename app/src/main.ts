import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // TODO: logger実装

  app.use(helmet());

  // TODO: session/cookieへ認証情報を保存
  app.use(cookieParser());
  app.use(
    session({
      secret: config.get<string>('session.secret', 'SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
    }),
  );

  await app.listen(3000);
}
bootstrap();

import { TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { TestModuleBuilder } from './test-util/TestModule';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await new TestModuleBuilder().build();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should be defined"', () => {
      expect(appController).toBeDefined();
    });
  });
});

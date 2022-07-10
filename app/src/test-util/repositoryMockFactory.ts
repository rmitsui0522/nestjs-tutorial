import { Repository } from 'typeorm';
import { MockType } from './TestModule';

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    find: jest.fn((entity) => entity),
    findOne: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    update: jest.fn((entity) => entity),
    upsert: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
  }),
);

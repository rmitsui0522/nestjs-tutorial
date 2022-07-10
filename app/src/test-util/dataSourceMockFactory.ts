import { DataSource } from 'typeorm';
import { MockType } from './repositoryMockFactory';

export const dataSourceMockFactory: () => MockType<DataSource> = jest.fn(
  () => ({ transaction: jest.fn().mockImplementation() }),
);

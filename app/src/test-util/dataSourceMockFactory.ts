import { DataSource } from 'typeorm';
import { MockType } from './TestModule';

export const dataSourceMockFactory: () => MockType<DataSource> = jest.fn(
  () => ({ transaction: jest.fn().mockImplementation() }),
);

import { JwtService } from '@nestjs/jwt';
import { MockType } from './TestModule';

export const jwtServiceMockFactory: () => MockType<JwtService> = jest.fn(
  () => ({
    sign: jest.fn(() => 'jwt-token'),
  }),
);

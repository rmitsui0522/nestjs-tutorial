import { JwtService } from '@nestjs/jwt';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const jwtServiceMockFactory: () => MockType<JwtService> = jest.fn(
  () => ({
    sign: jest.fn(() => 'jwt-token'),
  }),
);

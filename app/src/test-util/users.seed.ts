import { UserEntity } from '../users/entities/user.entity';

export const user: Omit<UserEntity, 'role'> = {
  id: 1,
  userName: 'testuser',
  email: 'test@user.com',
  password: 'testuser',
};

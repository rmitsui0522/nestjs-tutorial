import { RoleEntity } from '../roles/entities/role.entity';

export const role: Omit<RoleEntity, 'users'> = {
  id: 1,
  name: 'default',
};

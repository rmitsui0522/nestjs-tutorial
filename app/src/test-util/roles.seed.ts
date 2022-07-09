import { RoleEntity } from '../roles/entities/role.entity';
import { Role } from '../roles/enum/role.enum';

export const role: Omit<RoleEntity, 'users'> = {
  id: 1,
  name: Role.Default,
};

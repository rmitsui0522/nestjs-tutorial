import { UserEntity } from '../../users/entities/user.entity';

export class CustomClaims {
  id: UserEntity['id'];
  userName: UserEntity['userName'];
}

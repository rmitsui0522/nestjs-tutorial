import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(userName: string) {
    super(`User '${userName}' not found`);
  }
}

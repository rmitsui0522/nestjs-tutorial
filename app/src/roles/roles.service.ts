import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private repo: Repository<RoleEntity>,
  ) {}

  public findAll() {
    return this.repo.find({ relations: ['users'] });
  }

  public findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['users'] });
  }
}

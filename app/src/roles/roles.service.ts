import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private repo: Repository<RoleEntity>,
  ) {}

  private async isExists(
    role: Omit<RoleEntity, 'users'>,
  ): Promise<{ field: string; roleId: RoleEntity['id'] } | null> {
    let other: RoleEntity;

    other = await this.repo.findOne({
      where: { name: role.name },
    });
    if (other) {
      return { field: 'Name', roleId: other.id };
    }

    return null;
  }

  public async create(dto: CreateRoleDto) {
    const role = { id: null, name: dto.name };

    const duplicate = await this.isExists(role);
    if (duplicate) {
      throw new InternalServerErrorException(
        `Duplicated '${duplicate.field}'. Record '${duplicate.field}' must be unique.`,
      );
    }

    return this.repo.save(role);
  }

  public findAll() {
    return this.repo.find({ relations: ['users'] });
  }

  public findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['users'] });
  }

  public async update(id: number, dto: UpdateRoleDto) {
    const role = { id, name: dto.name };

    const duplicate = await this.isExists(role);
    // 更新対象自身の重複は許可
    if (duplicate && duplicate.roleId !== role.id) {
      throw new InternalServerErrorException(
        `Duplicated '${duplicate.field}'. Record '${duplicate.field}' must be unique.`,
      );
    }

    return this.repo.update(id, role);
  }
}

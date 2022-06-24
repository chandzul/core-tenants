import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenancy } from './entities/tenancy.entity';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { ReadTenancyDto } from './dto/read-tenancy.dto';
import { CreateTenancyDto } from './dto/create-tenancy.dto';

@Injectable()
export class TenancyService {
  constructor(
    @InjectRepository(Tenancy)
    private readonly tenantRepository: Repository<Tenancy>,
  ) {}

  async findAll() {
    const tenants = await this.tenantRepository.find();
    return tenants.map((tenant) => plainToClass(ReadTenancyDto, tenant));
  }

  async findOne(name: string) {
    return await this.tenantRepository.findOne({ where: { name } });
  }

  // async isActive(name: string): Promise<ReadTenantDto> {
  //   const tenant = await this.tenantRepository.findOne({
  //     where: { name, status: true },
  //   });
  //
  //   return plainToClass(ReadTenantDto, tenant);
  // }

  async create(tenant: CreateTenancyDto): Promise<ReadTenancyDto> {
    const createdTenant = await this.tenantRepository.save(tenant);

    return plainToClass(ReadTenancyDto, createdTenant);
  }
}

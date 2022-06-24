import { Controller, Get, Post, Body } from '@nestjs/common';
import { TenancyService } from './tenancy.service';
import { ReadTenancyDto } from './dto/read-tenancy.dto';
import { CreateTenancyDto } from './dto/create-tenancy.dto';

@Controller('tenants')
export class TenancyController {
  constructor(private readonly tenancyService: TenancyService) {}

  @Get()
  findAll(): Promise<ReadTenancyDto[]> {
    return this.tenancyService.findAll();
  }

  @Post()
  create(@Body() tenancy: CreateTenancyDto): Promise<ReadTenancyDto> {
    return this.tenancyService.create(tenancy);
  }
}

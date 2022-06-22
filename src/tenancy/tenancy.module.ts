import { Module } from '@nestjs/common';
import { TenancyService } from './tenancy.service';
import { TenancyController } from './tenancy.controller';

@Module({
  providers: [TenancyService],
  controllers: [TenancyController]
})
export class TenancyModule {}

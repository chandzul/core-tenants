import { Provider, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Connection, DataSource, getConnection } from 'typeorm';
import { Request } from 'express';

import { Tenancy } from './entities/tenancy.entity';
import { getDataSourceName } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const TENANT_CONNECTION = 'TENANT_CONNECTION';

/**
 * This Provider ejects every time with make a request on API,
 * Inject the connection
 */
export const TenancyProvider: Provider = {
  provide: TENANT_CONNECTION,
  inject: [REQUEST, DataSource],
  scope: Scope.REQUEST,
  useFactory: async (
    req: Request,
    connection: DataSource,
    configService: ConfigService,
  ) => {
    const name: string = req.params['tenant'];
    const tenant: Tenancy = await connection
      .getRepository(Tenancy)
      .findOne({ where: { name } });

    const type = configService.get('DB_TYPE');
    return getDataSourceName({
      type: type,
      schema: tenant.name,
    });
  },
};

import {
  BadRequestException,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { TenancyService } from './tenancy.service';
import { TenancyController } from './tenancy.controller';
import { getDataSourceName, TypeOrmModule } from '@nestjs/typeorm';
import { Tenancy } from './entities/tenancy.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Tenancy])],
  providers: [TenancyService],
  controllers: [TenancyController],
})
export class TenancyModule {
  constructor(
    private readonly connection: DataSource,
    private readonly configService: ConfigService,
    private readonly tenancyService: TenancyService,
  ) {}

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(async (req: Request, res: Response, next: NextFunction) => {
        const name: string = req.params['tenant'];
        const tenant: Tenancy = await this.tenancyService.findOne(name);
        console.log(tenant);

        if (!tenant) {
          throw new BadRequestException(
            'Database Connection Error',
            'This tenant does not exists',
          );
        }

        const type = this.configService.get('DB_TYPE');

        try {
          getDataSourceName({
            type: type,
            schema: tenant.name,
          });
          next();
        } catch (e) {
          switch (type) {
            case 'mysql':
              await this.connection.query(
                `CREATE DATABASE IF NOT EXISTS "${tenant.name}"`,
              );
              break;
            case 'postgres':
              await this.connection.query(
                `CREATE SCHEMA IF NOT EXISTS "${tenant.name}"`,
              );
              break;
          }

          /**
           * This configuration could get to config tenancy and connect with
           * credential defined there
           */
          const createdConnection: DataSource = await new DataSource({
            name: tenant.name,
            type: this.configService.get('DB_TYPE'),
            host: this.configService.get('DB_HOST'),
            port: +this.configService.get('DB_PORT'),
            username: this.configService.get('DB_USERNAME'),
            password: this.configService.get('DB_PASSWORD'),
            database: this.configService.get('DB_NAME'),
            schema: tenant.name,
            entities: [
              // Client,
              // ClientStatus,
              // Access,
              // AccessConfiguration,
              // User,
              // Customer,
            ], // TODO: add Client, User, and others entities, list entities to every tenant DB
            // ssl: true,
            synchronize: true,
            // logging: 'all',
          } as DataSourceOptions);

          if (createdConnection) {
            next();
          } else {
            throw new BadRequestException(
              'Database Connection Error',
              'There is a Error with the Database',
            );
          }
        }
      })
      .exclude({ path: '/api/tenants', method: RequestMethod.ALL })
      .forRoutes('*');
  }
}

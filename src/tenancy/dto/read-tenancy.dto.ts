import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsAlphanumeric, IsString } from 'class-validator';

@Exclude()
export class ReadTenancyDto {
  @IsNumber()
  @Expose()
  readonly id: number;

  @IsAlphanumeric()
  @Expose()
  readonly name: string;

  @IsString()
  @Expose()
  readonly description: string;
}

import {
  IsNotEmpty,
  IsAlphanumeric,
  MinLength,
  MaxLength,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTenancyDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(64)
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}

import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsBoolean()
  notifyLike?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyMessage?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyMarketing?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(4)
  fontSize?: number;

  @IsOptional()
  @IsString()
  brightnessMode?: 'auto' | 'manual';
}

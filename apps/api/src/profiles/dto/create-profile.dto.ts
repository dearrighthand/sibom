import { PartialType } from '@nestjs/swagger'; // Assuming swagger is used, or mapped-types
import {
  IsString,
  IsOptional,
  IsInt,
  IsArray,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Gender } from '@prisma/client';

export class CreateProfileDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  birthYear: number;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  location: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  meetingType?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
